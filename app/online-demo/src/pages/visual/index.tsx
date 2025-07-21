/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Container,
	CssBaseline,
	Grid2 as Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'
import { ChevronLeft, ChevronRight, FastForward, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { extractBoundaryMapping, searchSentenceByBoundaryMapping } from 'text-search-engine'

interface Step {
	stepNumber: number
	description: string
	matchIndex: number
	matchedPinyinIndex: number
	currentChar: string
	variables: Record<string, any>
	dpTable: number[][]
	dpScores: number[]
	dpMatchPath: any[][]
	highlightIndex?: number
}

interface SimulationResult {
	success?: boolean
	error?: string
	steps: Step[]
	finalResult?: {
		dpTable: number[][]
		dpScores: number[]
		dpMatchPath: any[][]
	}
}

function simulateDP(source: string, target: string): SimulationResult {
	const data = extractBoundaryMapping(source.toLowerCase())
	const pinyinString = data.pinyinString
	const boundary = data.boundary
	const targetLength = target.length
	const pinyinLength = pinyinString.length

	if (pinyinLength < targetLength) {
		return { error: '拼音长度小于目标长度，无法匹配', steps: [] }
	}

	const startBoundary = boundary[1][0]
	const endBoundary = boundary[1][1]

	// 找到匹配位置
	const matchPositions = Array(targetLength).fill(-1)
	let _matchIndex = 0
	for (let i = 0; i < pinyinLength && _matchIndex < targetLength; i++) {
		if (pinyinString[i] === target[_matchIndex]) {
			matchPositions[_matchIndex++] = i
		}
	}

	if (_matchIndex < targetLength) {
		return { error: '无法找到完整匹配', steps: [] }
	}

	const defaultDpTableValue = [0, 0, -1, -1]
	const dpTable = Array.from({ length: pinyinLength + 1 }, () => [...defaultDpTableValue])
	const dpScores = Array(pinyinLength + 1).fill(0)
	const dpMatchPath = Array.from({ length: pinyinLength + 1 }, () => Array(targetLength))

	const steps: Step[] = []
	let stepCount = 0

	// 记录初始状态
	steps.push({
		stepNumber: stepCount++,
		description: '初始化状态',
		matchIndex: -1,
		matchedPinyinIndex: -1,
		currentChar: '',
		variables: {
			matchPositions: [...matchPositions],
			pinyinString: pinyinString,
			target: target,
			explanation: '初始化 dpTable 为默认值 [0,0,-1,-1]，dpScores 全为 0，dpMatchPath 为空数组',
		},
		dpTable: dpTable.map((row) => [...row]),
		dpScores: [...dpScores],
		dpMatchPath: dpMatchPath.map((row) => [...row]),
	})

	for (let matchIndex = 0; matchIndex < matchPositions.length; matchIndex++) {
		let matchedPinyinIndex = matchPositions[matchIndex] + 1
		const currentChar = target[matchIndex]

		let currentDpTableItem = [...dpTable[matchedPinyinIndex - 1]]
		let currentScore = dpScores[matchedPinyinIndex - 1]

		dpScores[matchedPinyinIndex - 1] = 0
		dpTable[matchedPinyinIndex - 1] = [...defaultDpTableValue]

		let foundValidMatchForCurrentChar = false

		for (; matchedPinyinIndex <= pinyinLength; matchedPinyinIndex++) {
			const prevScore = currentScore
			const [prevMatchedCharacters, prevMatchedLetters, prevBoundaryStart, prevBoundaryEnd] = currentDpTableItem

			// 缓存下一个位置的值
			currentDpTableItem = [...dpTable[matchedPinyinIndex]]
			currentScore = dpScores[matchedPinyinIndex]

			const isNewWord =
				matchedPinyinIndex - 1 === boundary[matchedPinyinIndex][1] - endBoundary &&
				prevBoundaryStart !== boundary[matchedPinyinIndex][0] - startBoundary

			const isContinuation =
				prevMatchedCharacters > 0 &&
				prevBoundaryEnd === boundary[matchedPinyinIndex][1] - endBoundary &&
				pinyinString[matchedPinyinIndex - 2] === target[matchIndex - 1]

			const isEqual = pinyinString[matchedPinyinIndex - 1] === target[matchIndex]

			const currentPinyinChar = pinyinString[matchedPinyinIndex - 1]
			const currentTargetChar = target[matchIndex]
			const checkPosition = matchedPinyinIndex

			let matchResult: string
			let newScoreValue: number | null = null
			let updatedDpTable: number[] | null = null
			let updatedDpMatchPath: number[] | null = null
			let gapValue: number | undefined
			let finalDpTable: number[] | undefined

			if (isEqual && (isNewWord || isContinuation) && (matchIndex === 0 || prevScore > 0)) {
				const newScore = prevScore + prevMatchedLetters * 2 + 1
				const matchedLettersCount = prevMatchedLetters + 1

				if (newScore >= dpScores[matchedPinyinIndex - 1]) {
					dpScores[matchedPinyinIndex] = newScore
					dpTable[matchedPinyinIndex] = [
						prevMatchedCharacters + ~~isNewWord,
						matchedLettersCount,
						boundary[matchedPinyinIndex][0] - startBoundary,
						boundary[matchedPinyinIndex][1] - endBoundary,
					]

					const originalStringIndex = boundary[matchedPinyinIndex][0] - startBoundary
					const newMatched = newScore > dpScores[matchedPinyinIndex - 1]
					dpMatchPath[matchedPinyinIndex][matchIndex] = newMatched
						? [originalStringIndex - prevMatchedCharacters + ~~!isNewWord, originalStringIndex, matchedLettersCount]
						: dpMatchPath[matchedPinyinIndex - 1][matchIndex]

					foundValidMatchForCurrentChar = true
					matchResult = '✅ 匹配成功！更新状态'
					newScoreValue = newScore
					updatedDpTable = [...dpTable[matchedPinyinIndex]]
					updatedDpMatchPath = dpMatchPath[matchedPinyinIndex][matchIndex]
						? [...dpMatchPath[matchedPinyinIndex][matchIndex]]
						: null
				} else {
					matchResult = '❌ 得分不够高，不更新状态'
					newScoreValue = null
					updatedDpTable = null
					updatedDpMatchPath = null
				}
			} else {
				dpScores[matchedPinyinIndex] = dpScores[matchedPinyinIndex - 1]
				dpMatchPath[matchedPinyinIndex][matchIndex] = dpMatchPath[matchedPinyinIndex - 1][matchIndex]

				const gap = boundary[matchedPinyinIndex][0] - startBoundary - dpTable[matchedPinyinIndex - 1][2]
				const isSameWord = () => boundary[matchedPinyinIndex][0] === boundary[matchedPinyinIndex + 1][0]
				const isWithInRange = matchedPinyinIndex < pinyinLength - 1

				dpTable[matchedPinyinIndex] =
					gap === 0 || (isWithInRange && gap === 1 && isSameWord())
						? [...dpTable[matchedPinyinIndex - 1]]
						: [...defaultDpTableValue]

				matchResult = '⏭️ 不匹配，继承前一个状态或重置为默认值'
				gapValue = gap
				finalDpTable = [...dpTable[matchedPinyinIndex]]
				newScoreValue = null
				updatedDpTable = null
				updatedDpMatchPath = null
			}

			steps.push({
				stepNumber: stepCount++,
				description: `处理字符 '${currentChar}' (matchIndex=${matchIndex})`,
				matchIndex: matchIndex,
				matchedPinyinIndex: matchedPinyinIndex,
				currentChar: currentChar,
				variables: {
					checkPosition,
					currentPinyinChar,
					currentTargetChar,
					isEqual,
					isNewWord,
					isContinuation,
					prevScore,
					prevMatchedCharacters,
					prevMatchedLetters,
					matchResult,
					newScoreValue,
					updatedDpTable,
					updatedDpMatchPath,
					...(typeof gapValue !== 'undefined' ? { gapValue } : {}),
					...(typeof finalDpTable !== 'undefined' ? { finalDpTable } : {}),
				},
				dpTable: dpTable.map((row) => [...row]),
				dpScores: [...dpScores],
				dpMatchPath: dpMatchPath.map((row) => [...row]),
				highlightIndex: matchedPinyinIndex,
			})
		}

		if (!foundValidMatchForCurrentChar) {
			return {
				error: `无法为字符 '${currentChar}' 找到有效匹配`,
				steps: steps,
			}
		}
	}

	return {
		success: true,
		steps: steps,
		finalResult: {
			dpTable: dpTable,
			dpScores: dpScores,
			dpMatchPath: dpMatchPath,
		},
	}
}

export default function Visual() {
	const [sourceText, setSourceText] = useState('你好web')
	const [targetText, setTargetText] = useState('nwe')
	const [allSteps, setAllSteps] = useState<Step[]>([])
	const [currentStepIndex, setCurrentStepIndex] = useState(0)
	const [results, setResults] = useState<SimulationResult | null>(null)
	const [showTables, setShowTables] = useState(false)
	const [mappingData, setMappingData] = useState<any>(null)

	const analyzeAlgorithm = useCallback(() => {
		if (!sourceText || !targetText) {
			setResults({ error: '请输入源文本和目标文本', steps: [] })
			setShowTables(false)
			setMappingData(null)
			return
		}

		// 获取 mappingData
		const data = extractBoundaryMapping(sourceText.toLowerCase())
		setMappingData(data)

		const simulationResults = simulateDP(sourceText, targetText)
		setResults(simulationResults)

		if (simulationResults.success) {
			setAllSteps(simulationResults.steps)
			setCurrentStepIndex(0)
			setShowTables(true)
		} else {
			setShowTables(false)
		}
	}, [sourceText, targetText])

	const nextStep = useCallback(() => {
		if (currentStepIndex < allSteps.length - 1) {
			setCurrentStepIndex(currentStepIndex + 1)
		}
	}, [currentStepIndex, allSteps.length])

	const previousStep = useCallback(() => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(currentStepIndex - 1)
		}
	}, [currentStepIndex])

	const resetToStart = useCallback(() => {
		setCurrentStepIndex(0)
	}, [])

	const jumpToLastStep = useCallback(() => {
		setCurrentStepIndex(allSteps.length - 1)
	}, [allSteps.length])

	// 监听输入变化，自动触发分析
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (sourceText.trim() && targetText.trim()) {
				analyzeAlgorithm()
			} else {
				// 清空结果
				setResults(null)
				setShowTables(false)
				setMappingData(null)
				setAllSteps([])
				setCurrentStepIndex(0)
			}
		}, 300) // 300ms 防抖

		return () => clearTimeout(timeoutId)
	}, [sourceText, targetText, analyzeAlgorithm])

	// 监听键盘事件
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!showTables || allSteps.length === 0) return

			switch (event.key) {
				case 'ArrowLeft':
					event.preventDefault()
					previousStep()
					break
				case 'ArrowRight':
					event.preventDefault()
					nextStep()
					break
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [showTables, allSteps.length, previousStep, nextStep])

	const currentStep = allSteps[currentStepIndex]

	const generateTableHTML = (dpTable: number[][], highlightIndex?: number) => {
		return (
			<TableContainer component={Paper} className='max-h-96 overflow-auto'>
				<Table size='small' stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell className='font-bold text-xs'>索引</TableCell>
							<TableCell className='font-bold text-xs'>匹配字符数</TableCell>
							<TableCell className='font-bold text-xs'>匹配字母数</TableCell>
							<TableCell className='font-bold text-xs'>边界开始</TableCell>
							<TableCell className='font-bold text-xs'>边界结束</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{dpTable.map((row, index) => (
							<TableRow
								key={`dp-table-row-${index}`}
								className={index === highlightIndex ? 'bg-yellow-300 font-bold' : ''}
							>
								<TableCell className='text-xs'>{index}</TableCell>
								<TableCell className='text-xs'>{row[0]}</TableCell>
								<TableCell className='text-xs'>{row[1]}</TableCell>
								<TableCell className='text-xs'>{row[2]}</TableCell>
								<TableCell className='text-xs'>{row[3]}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		)
	}

	const generateScoresHTML = (dpScores: number[], highlightIndex?: number) => {
		return (
			<TableContainer component={Paper} className='max-h-96 overflow-auto'>
				<Table size='small' stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell className='font-bold text-xs'>索引</TableCell>
							<TableCell className='font-bold text-xs'>得分</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{dpScores.map((score, index) => (
							<TableRow
								key={`dp-scores-row-${index}`}
								className={index === highlightIndex ? 'bg-yellow-300 font-bold' : ''}
							>
								<TableCell className='text-xs'>{index}</TableCell>
								<TableCell className='text-xs'>{score}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		)
	}

	const generateMatchPathHTML = (dpMatchPath: any[][], highlightIndex?: number, matchIndex?: number) => {
		const maxMatchIndex = Math.max(...dpMatchPath.map((row) => row.length))

		return (
			<TableContainer component={Paper} className='max-h-96 overflow-auto'>
				<Table size='small' stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell className='font-bold text-xs'>索引</TableCell>
							{Array.from({ length: maxMatchIndex }, (_, i) => (
								<TableCell key={`match-header-${i}`} className='font-bold text-xs'>
									Match {i}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{dpMatchPath.map((row, index) => (
							<TableRow
								key={`dp-match-path-row-${index}`}
								className={index === highlightIndex ? 'bg-yellow-300 font-bold' : ''}
							>
								<TableCell className='text-xs'>{index}</TableCell>
								{Array.from({ length: maxMatchIndex }, (_, i) => {
									const cellClass = index === highlightIndex && i === matchIndex ? 'bg-green-200 font-bold' : ''
									const value = row[i] ? `[${row[i].join(',')}]` : 'undefined'
									return (
										<TableCell key={`match-cell-${index}-${i}`} className={`text-xs ${cellClass}`}>
											{value}
										</TableCell>
									)
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		)
	}

	return (
		<div className='min-h-screen'>
			<CssBaseline />
			<Container sx={{ mt: 4, mb: 4, flex: 1, maxWidth: '95vw!important', width: '100%' }}>
				<Paper className='p-4 rounded-lg shadow-lg'>
					<Typography
						variant='h4'
						component='h1'
						className='text-center mb-4 pb-2 border-b-2 border-blue-600 text-gray-800'
					>
						动态规划过程可视化
					</Typography>

					{/* 输入区域 */}
					<Paper className='bg-gray-50 p-4 mb-4 border-l-4 border-blue-600'>
						<Grid container spacing={2} alignItems='center'>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label='源文本 (originalString)'
									value={sourceText}
									onChange={(e) => setSourceText(e.target.value)}
									placeholder='输入源文本，如: nonod'
									size='small'
									variant='outlined'
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label='目标文本 (target)'
									value={targetText}
									onChange={(e) => setTargetText(e.target.value)}
									placeholder='输入目标文本，如: nod'
									size='small'
									variant='outlined'
								/>
							</Grid>
						</Grid>
						<Typography variant='caption' className='text-gray-600 mt-2 block'>
							💡 输入文本后将自动开始分析
						</Typography>
					</Paper>

					{/* 结果展示 */}
					{results && (
						<Box className='mb-4'>
							{results.error ? (
								<Alert severity='error' className='border-l-4 border-red-500'>
									❌ 错误: {results.error}
								</Alert>
							) : (
								<Alert severity='success' className='border-l-4 border-blue-500'>
									<Typography variant='h6' className='mb-1'>
										🎯 算法执行成功！
									</Typography>
									<Typography variant='body2'>使用下方的固定表格区域查看每一步的详细执行过程。</Typography>

									{/* 命中高亮展示 */}
									{mappingData &&
										(() => {
											const { hitRanges } = searchSentenceByBoundaryMapping(mappingData, targetText)
											if (hitRanges && hitRanges.length > 0) {
												return (
													<Box className='mt-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg shadow-sm'>
														<Typography
															variant='subtitle2'
															className='font-bold mb-3 text-blue-800 flex items-center gap-2'
														>
															🎯 命中高亮结果
														</Typography>
														<Box className='font-mono text-lg mb-3 p-3 bg-white rounded-md border border-blue-100'>
															{mappingData.originalString.split('').map((char: string, index: number) => {
																const isHighlighted = hitRanges.some(([start, end]) => index >= start && index <= end)
																return (
																	<span
																		key={`highlight-char-${index}-${char}`}
																		className={
																			isHighlighted
																				? 'bg-blue-100 text-blue-800 font-bold px-1 py-0.4 rounded-md border border-blue-200'
																				: 'text-gray-700'
																		}
																	>
																		{char}
																	</span>
																)
															})}
														</Box>
														<Typography variant='body2' className='mt-2 text-blue-700 bg-blue-100 px-3 py-2 rounded-md'>
															📍 命中范围: {hitRanges.map(([start, end]) => `[${start}, ${end}]`).join(', ')}
														</Typography>
													</Box>
												)
											}
											return null
										})()}
								</Alert>
							)}
						</Box>
					)}

					{/* 固定 Boundary Mapping 数据展示 */}
					{mappingData && (
						<Paper className='bg-purple-50 p-3 mb-4 border-l-4 border-purple-500'>
							<Typography variant='h6' className='mb-2 text-purple-800'>
								🗺️ Boundary Mapping 数据
							</Typography>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, md: 6 }}>
									<Box className='bg-gray-100 p-2 rounded'>
										<Typography variant='subtitle2' className='font-bold mb-1'>
											原始字符串:
										</Typography>
										<Box className='font-mono text-sm'>{mappingData.originalString}</Box>
									</Box>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<Box className='bg-gray-100 p-2 rounded'>
										<Typography variant='subtitle2' className='font-bold mb-1'>
											拼音字符串:
										</Typography>
										<Box className='font-mono text-sm'>{mappingData.pinyinString}</Box>
									</Box>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<Box className='bg-gray-100 p-2 rounded'>
										<Typography variant='subtitle2' className='font-bold mb-1'>
											边界映射 (boundary):
										</Typography>
										<Box className='font-mono text-xs max-h-32 overflow-y-auto'>
											{JSON.stringify(mappingData.boundary, null, 2)}
										</Box>
									</Box>
								</Grid>
								{mappingData.originalIndices && (
									<Grid size={{ xs: 12, md: 6 }}>
										<Box className='bg-gray-100 p-2 rounded'>
											<Typography variant='subtitle2' className='font-bold mb-1'>
												原始索引:
											</Typography>
											<Box className='font-mono text-xs'>{JSON.stringify(mappingData.originalIndices)}</Box>
										</Box>
									</Grid>
								)}
								{mappingData.originalLength !== undefined && (
									<Grid size={{ xs: 12, md: 6 }}>
										<Box className='bg-gray-100 p-2 rounded'>
											<Typography variant='subtitle2' className='font-bold mb-1'>
												原始长度:
											</Typography>
											<Box className='font-mono text-sm'>{mappingData.originalLength}</Box>
										</Box>
									</Grid>
								)}
							</Grid>
						</Paper>
					)}

					{/* 固定表格展示区域 */}
					{showTables && currentStep && (
						<Paper className='p-3 mb-4 shadow-lg'>
							<Typography variant='h5' className='mb-3 text-gray-800'>
								📊 动态规划表格实时状态
							</Typography>

							{/* 导航控制 */}
							<Paper className='bg-gray-50 p-3 mb-3 border-l-4 border-green-500'>
								<Box className='flex justify-between items-center'>
									<Box className='flex gap-2'>
										<Button
											variant='contained'
											size='small'
											startIcon={<ChevronLeft />}
											onClick={previousStep}
											disabled={currentStepIndex === 0}
											className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
										>
											⬅️ 上一步
										</Button>
										<Button
											variant='contained'
											size='small'
											endIcon={<ChevronRight />}
											onClick={nextStep}
											disabled={currentStepIndex === allSteps.length - 1}
											className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
										>
											下一步 ➡️
										</Button>
										<Button
											variant='contained'
											size='small'
											startIcon={<FastForward />}
											onClick={jumpToLastStep}
											disabled={currentStepIndex === allSteps.length - 1}
											className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
										>
											⏩ 快进到最后一步
										</Button>
										<Button
											variant='contained'
											size='small'
											startIcon={<RotateCcw />}
											onClick={resetToStart}
											className='bg-green-600 hover:bg-green-700'
										>
											🔄 重置
										</Button>
									</Box>
									<Box>
										<Typography variant='body2' className='font-bold text-gray-600'>
											步骤 {currentStepIndex + 1} / {allSteps.length}
										</Typography>
									</Box>
								</Box>
							</Paper>

							{/* 当前步骤说明 */}
							<Paper className='bg-green-50 p-3 mb-3 border-l-4 border-green-500'>
								<Typography variant='h6' className='mb-2 text-green-800'>
									💡 当前步骤说明
								</Typography>

								{/* For 循环可视化 */}
								{mappingData && currentStep.matchedPinyinIndex >= 0 && (
									<Box className='mb-3'>
										<Box className='bg-white p-2 rounded border'>
											{/* 目标字符串遍历 */}
											<Typography variant='body2' className='mb-1 text-gray-600'>
												目标字符串遍历 (当前位置: {currentStep.matchIndex})
											</Typography>
											<Box className='flex flex-wrap gap-1 font-mono text-sm mb-3'>
												{targetText.split('').map((char: string, index: number) => (
													<Box
														key={`target-char-${index}-${char}`}
														className={`px-2 py-1 rounded border ${
															index === currentStep.matchIndex
																? 'bg-blue-300 border-blue-500 font-bold'
																: index < currentStep.matchIndex
																	? 'bg-green-100 border-green-300'
																	: 'bg-gray-100 border-gray-300'
														}`}
													>
														{char}
														<Box className='text-xs text-gray-500'>{index}</Box>
													</Box>
												))}
											</Box>

											{/* 拼音字符串遍历 */}
											<Typography variant='body2' className='mb-1 text-gray-600'>
												拼音字符串遍历 (当前位置: {currentStep.matchedPinyinIndex})
											</Typography>
											<Box className='flex flex-wrap gap-1 font-mono text-sm'>
												{mappingData.pinyinString.split('').map((char: string, index: number) => (
													<Box
														key={`pinyin-char-${index}-${char}`}
														className={`px-2 py-1 rounded border ${
															index === currentStep.matchedPinyinIndex - 1
																? 'bg-yellow-300 border-yellow-500 font-bold'
																: index < currentStep.matchedPinyinIndex - 1
																	? 'bg-green-100 border-green-300'
																	: 'bg-gray-100 border-gray-300'
														}`}
													>
														{char}
														<Box className='text-xs text-gray-500'>{index}</Box>
													</Box>
												))}
											</Box>
											<Typography variant='body2' className='mt-2 text-sm text-gray-600 flex items-center flex-wrap'>
												<span className='inline-block w-4 h-4 bg-blue-300 border border-blue-500 rounded mr-1'></span>
												当前目标字符
												<span className='inline-block w-4 h-4 bg-yellow-300 border border-yellow-500 rounded mr-1 ml-3'></span>
												当前拼音位置
												<span className='inline-block w-4 h-4 bg-green-100 border border-green-300 rounded mr-1 ml-3'></span>
												已处理位置
												<span className='inline-block w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-1 ml-3'></span>
												未处理位置
											</Typography>
										</Box>
									</Box>
								)}
							</Paper>

							{/* 表格区域 */}
							<Grid container spacing={2} className='mb-3'>
								<Grid size={{ xs: 12, lg: 4 }}>
									<Card>
										<CardHeader
											title='📋 dpTable'
											classes={{ title: 'text-center text-sm font-bold bg-gray-100 p-1 rounded' }}
										/>
										<CardContent className='p-2'>
											{generateTableHTML(currentStep.dpTable, currentStep.highlightIndex)}
										</CardContent>
									</Card>
								</Grid>

								<Grid size={{ xs: 12, lg: 4 }}>
									<Card>
										<CardHeader
											title='📊 dpScores'
											classes={{ title: 'text-center text-sm font-bold bg-gray-100 p-1 rounded' }}
										/>
										<CardContent className='p-2'>
											{generateScoresHTML(currentStep.dpScores, currentStep.highlightIndex)}
										</CardContent>
									</Card>
								</Grid>

								<Grid size={{ xs: 12, lg: 4 }}>
									<Card>
										<CardHeader
											title='🛤️ dpMatchPath'
											classes={{ title: 'text-center text-sm font-bold bg-gray-100 p-1 rounded' }}
										/>
										<CardContent className='p-2'>
											{generateMatchPathHTML(
												currentStep.dpMatchPath,
												currentStep.highlightIndex,
												currentStep.matchIndex
											)}
										</CardContent>
									</Card>
								</Grid>
							</Grid>

							{/* 当前变量状态 */}
							{currentStep.variables && (
								<Paper className='bg-orange-50 p-3 mb-3 border-l-4 border-orange-500'>
									<Typography variant='h6' className='mb-2 text-orange-800'>
										🔧 当前变量状态
									</Typography>
									<Grid container spacing={1}>
										{Object.entries(currentStep.variables).map(([key, value]) => (
											<Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
												<Box className='bg-gray-100 p-2 rounded font-mono text-xs'>
													<strong>{key}:</strong> {JSON.stringify(value)}
												</Box>
											</Grid>
										))}
									</Grid>
								</Paper>
							)}
						</Paper>
					)}
				</Paper>
			</Container>
		</div>
	)
}
