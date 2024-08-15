import { Card, CardContent, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { type Matrix, extractBoundaryMapping, searchSentenceByBoundaryMapping } from 'text-search-engine'
import { TEXT_ACTIVE_CONFIG } from '../../config/index'
import { useStyles } from '../../hooks/useStyles'
import { IconParkNames } from '../../shared/constants'
import { Schools } from '../../shared/schools'
import { decodeURIComponentPlus, encodeURIComponentPlus } from '../../shared/utils'
import LightTooltip from '../LighTooltip'
import LightedText from '../LightedText'
import LinkWithIcon from '../link-with-icon'
import styles from './index.module.css'

interface ListItemType {
	passValue: string
	hitRanges?: Matrix
}

const ListSearch = () => {
	const classes = useStyles()
	const inputRef = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLUListElement>(null)
	const [originalList, setOriginalList] = useState<string[]>(Schools)
	const [inputValue, setInputValue] = useState('')
	const [newItem, setNewItem] = useState('')
	const [searParams, setSearchParams] = useSearchParams()
	const kw = searParams.get('kw') || ''

	const sourceMappingArray = useMemo(() => {
		listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
		return originalList.map((item) => ({
			...extractBoundaryMapping(item.toLocaleLowerCase()),
			passValue: item,
		}))
	}, [originalList])

	const [filteredList, count, searchTime] = useMemo(() => {
		if (!inputValue) {
			return [sourceMappingArray.map((i) => ({ passValue: i.passValue })) as ListItemType[], 0, 0]
		}
		const start = performance.now()
		const filteredData = sourceMappingArray
			.reduce<ListItemType[]>((acc, item) => {
				const hitRanges = searchSentenceByBoundaryMapping(item, inputValue)
				hitRanges &&
					acc.push({
						passValue: item.passValue,
						hitRanges,
					})
				return acc
			}, [])
			.sort((a, b) => {
				if (a.hitRanges && b.hitRanges) {
					return a.hitRanges.length - b.hitRanges.length
				}
				return 0
			})
		return [filteredData, filteredData.length, performance.now() - start]
	}, [inputValue, sourceMappingArray])

	const handleAddItem = useCallback(() => {
		if (originalList.includes(newItem)) {
			throw new Error(`${newItem} already exists`)
		}
		setOriginalList([newItem, ...originalList])
		setNewItem('')
	}, [newItem, originalList])
	useEffect(() => {
		inputRef.current?.focus()
		kw && setInputValue(decodeURIComponentPlus(kw))
	}, [kw])

	return (
		<Card
			sx={{
				transition: 'all 0.3s ease-in-out',
				backgroundColor: 'var(--color-linear-bg-start)',
				color: 'var(--color-neutral-1)',
			}}
		>
			<CardContent>
				<Typography variant='h5' component='div' gutterBottom>
					List Filtering
					<div style={{ display: 'inline-block', float: 'right' }}>
						<LightTooltip title='You can also access our API through the console. The instance is encapsulated in window._TEXT_SEARCH_ENGINE_'>
							<div className='flex items-center cursor-pointer'>
								<LinkWithIcon name={IconParkNames.tips} />
							</div>
						</LightTooltip>
					</div>
				</Typography>
				<TextField
					fullWidth
					inputRef={inputRef}
					label="Enter keywords to filter(like 'zhog' or 'fujian' or 'beijing)"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value)
						setSearchParams({ kw: encodeURIComponentPlus(e.target.value) })
					}}
					variant='standard'
					className={`input-field ${classes.customTextField}`}
					sx={{
						mb: 2,
					}}
				/>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					<span className='text-skin-neutral-5'>
						found {count} matches in {searchTime.toFixed(2)} milliseconds
					</span>
				</Typography>
				<List
					sx={(theme) => ({
						[theme.breakpoints.down('sm')]: {
							maxHeight: '40vh',
							overflow: 'auto',
						},
						[theme.breakpoints.up('sm')]: {
							maxHeight: '50vh',
							overflow: 'auto',
						},
					})}
					ref={listRef}
				>
					{filteredList.map((item, index) => (
						<ListItem
							className={`${styles.listItem} ${classes.customListItem}`}
							key={`${item.passValue}-${index}`}
							sx={{
								transition: 'all 0.3s ease-in-out',
								'&:hover': { backgroundColor: 'action.hover' },
								height: '40px',
								minHeight: 'unset',
							}}
						>
							<ListItemText
								primary={
									<Typography sx={{ ...TEXT_ACTIVE_CONFIG }}>
										<LightedText text={item.passValue} ranges={item.hitRanges} className='bg-yellow font-bold' />
									</Typography>
								}
							/>
							<span className={styles.deleteBtn}>
								<LinkWithIcon
									name={IconParkNames.delete}
									onClick={() => {
										setOriginalList(originalList.filter((i) => i !== item.passValue))
									}}
								/>
							</span>
						</ListItem>
					))}
				</List>
				<Typography variant='h6' component='div' gutterBottom>
					Add Data
				</Typography>
				<TextField
					fullWidth
					label="Typing something then key down 'enter' to add"
					value={newItem}
					onChange={(e) => setNewItem(e.target.value)}
					variant='standard'
					className={`input-field ${classes.customTextField}`}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleAddItem()
					}}
					InputProps={{
						endAdornment: <LinkWithIcon name={IconParkNames.add} onClick={handleAddItem} />,
					}}
					sx={{
						mb: 2,
					}}
				/>
			</CardContent>
		</Card>
	)
}

export default memo(ListSearch)
