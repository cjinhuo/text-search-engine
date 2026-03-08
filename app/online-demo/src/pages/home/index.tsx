import { Button, Container, CssBaseline, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as TextSearchEngine from 'text-search-engine'

window._TEXT_SEARCH_ENGINE_ = TextSearchEngine

const BOARD_SIZE = 20
const INITIAL_SNAKE = [
	{ x: 8, y: 10 },
	{ x: 9, y: 10 },
	{ x: 10, y: 10 },
]
const INITIAL_DIRECTION = { x: 1, y: 0 }

type Point = {
	x: number
	y: number
}

type GameState = 'playing' | 'game-over'

function getRandomFood(snake: Point[]) {
	while (true) {
		const next = {
			x: Math.floor(Math.random() * BOARD_SIZE),
			y: Math.floor(Math.random() * BOARD_SIZE),
		}
		const collision = snake.some((body) => body.x === next.x && body.y === next.y)
		if (!collision) {
			return next
		}
	}
}

export default function Home() {
	const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE)
	const [direction, setDirection] = useState(INITIAL_DIRECTION)
	const [food, setFood] = useState<Point>(() => getRandomFood(INITIAL_SNAKE))
	const [score, setScore] = useState(0)
	const [state, setState] = useState<GameState>('playing')
	const directionRef = useRef(INITIAL_DIRECTION)

	const snakeCells = useMemo(() => {
		const head = snake[snake.length - 1]
		return new Set(
			snake.map((item, index) => (index === snake.length - 1 ? `${item.x},${item.y},head` : `${item.x},${item.y},body`))
		).add(`${head.x},${head.y},head`)
	}, [snake])

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			const keyMap: Record<string, Point> = {
				ArrowUp: { x: 0, y: -1 },
				ArrowDown: { x: 0, y: 1 },
				ArrowLeft: { x: -1, y: 0 },
				ArrowRight: { x: 1, y: 0 },
				w: { x: 0, y: -1 },
				s: { x: 0, y: 1 },
				a: { x: -1, y: 0 },
				d: { x: 1, y: 0 },
			}
			const next = keyMap[event.key]
			if (!next) {
				return
			}
			const current = directionRef.current
			if (current.x + next.x === 0 && current.y + next.y === 0) {
				return
			}
			directionRef.current = next
			setDirection(next)
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	useEffect(() => {
		if (state !== 'playing') {
			return
		}
		const timer = window.setInterval(() => {
			setSnake((prev) => {
				const head = prev[prev.length - 1]
				const nextHead = {
					x: head.x + directionRef.current.x,
					y: head.y + directionRef.current.y,
				}
				const hitsWall = nextHead.x < 0 || nextHead.x >= BOARD_SIZE || nextHead.y < 0 || nextHead.y >= BOARD_SIZE
				const hitsBody = prev.some((body) => body.x === nextHead.x && body.y === nextHead.y)
				if (hitsWall || hitsBody) {
					setState('game-over')
					return prev
				}
				const eatsFood = nextHead.x === food.x && nextHead.y === food.y
				const nextSnake = eatsFood ? [...prev, nextHead] : [...prev.slice(1), nextHead]
				if (eatsFood) {
					setScore((current) => current + 1)
					setFood(getRandomFood(nextSnake))
				}
				return nextSnake
			})
		}, 160)
		return () => window.clearInterval(timer)
	}, [food.x, food.y, state])

	function restart() {
		directionRef.current = INITIAL_DIRECTION
		setDirection(INITIAL_DIRECTION)
		setSnake(INITIAL_SNAKE)
		setFood(getRandomFood(INITIAL_SNAKE))
		setScore(0)
		setState('playing')
	}

	return (
		<div>
			<CssBaseline />
			<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<Container
					sx={{
						mt: 4,
						mb: 4,
						flex: 1,
						maxWidth: '80vw!important',
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 2,
					}}
				>
					<Typography variant='h3' sx={{ fontWeight: 700 }}>
						React 贪吃蛇
					</Typography>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='h6'>分数：{score}</Typography>
						<Typography variant='body1'>
							方向：({direction.x}, {direction.y})
						</Typography>
						{state === 'game-over' && (
							<Typography color='error' sx={{ fontWeight: 600 }}>
								游戏结束
							</Typography>
						)}
					</Stack>
					<div
						style={{
							width: 560,
							height: 560,
							border: '3px solid #121212',
							display: 'grid',
							gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
							background: '#f5f5f5',
						}}
					>
						{Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
							const x = index % BOARD_SIZE
							const y = Math.floor(index / BOARD_SIZE)
							const head = snakeCells.has(`${x},${y},head`)
							const body = snakeCells.has(`${x},${y},body`)
							const isFood = food.x === x && food.y === y
							const bg = head ? '#1b5e20' : body ? '#43a047' : isFood ? '#d32f2f' : 'transparent'
							return (
								<div
									key={`${x}-${y}`}
									style={{
										border: '1px solid #e0e0e0',
										background: bg,
									}}
								/>
							)
						})}
					</div>
					<Stack direction='row' spacing={2}>
						<Button variant='contained' onClick={restart}>
							重新开始
						</Button>
						<Typography variant='body2' sx={{ alignSelf: 'center' }}>
							用方向键或 WASD 控制
						</Typography>
					</Stack>
				</Container>
			</div>
		</div>
	)
}
