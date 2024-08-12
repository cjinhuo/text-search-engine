import { Card, CardContent, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { INPUT_ANIMATION_CONFIG, TEXT_ACTIVE_CONFIG } from '../../config/index'
import { useDebounce } from '../../hooks/useDebounce'
import { IconParkNames } from '../../shared/constants'
import LightedText from '../LightedText'
import LinkWithIcon from '../link-with-icon'
import styles from './index.module.css'
interface Iprops {
	children?: ReactNode
	list: Array<string>
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	setList: any
}
const ListSearch: FC<Iprops> = ({ list, setList }) => {
	const [listSearchTerm, setListSearchTerm] = useState('')
	const [newItem, setNewItem] = useState('')
	const [filteredItems, setFilteredItems] = useState(list.filter((item) => !!item))
	const [listSearchTime, setListSearchTime] = useState(0)
	const [listHeight, setListHeight] = useState<number>(0)
	const debounceValue = useDebounce(listSearchTerm, 500)
	const [count, setCount] = useState(0)
	const [flag, setFlag] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const regex = new RegExp(`(${listSearchTerm})`)
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [rangeItems, setRangeItems] = useState<any>([])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const startTime = performance.now()
		const filtered = list.filter((item) => item.toLowerCase().includes(debounceValue.toLowerCase()))
		setFilteredItems(filtered)
		const endTime = performance.now()
		const tempArr = []

		if (debounceValue) {
			setCount(filtered.length)
			for (const item of filtered) {
				tempArr.push(getRanges(item, debounceValue))
			}
			setRangeItems([...tempArr])
			setListSearchTime(endTime - startTime)
		} else {
			setCount(0)
			setListSearchTime(0)
			setRangeItems([])
		}
		containerRef.current && setListHeight(window.innerHeight - containerRef.current?.offsetTop)
		setFlag(!flag)
	}, [list, debounceValue])
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const getRanges: any = (text: string, kw: string) => {
		const ranges = window._TEXT_SEARCH_ENGINE_.search(text, kw)
		return ranges
	}
	console.log(rangeItems)
	return (
		<Card sx={{ transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}>
			<CardContent>
				<Typography variant='h5' component='div' gutterBottom>
					List Filtering
				</Typography>
				<Typography variant='h6' component='div' gutterBottom>
					Add Data
				</Typography>
				<TextField
					fullWidth
					label='Entering new data items...'
					value={newItem}
					onChange={(e) => setNewItem(e.target.value)}
					variant='standard'
					className='input-field'
					InputProps={{
						endAdornment: (
							<LinkWithIcon
								name={IconParkNames.add}
								onClick={() => {
									setList([...list, newItem])
									setNewItem('')
								}}
							/>
						),
					}}
					sx={{
						mb: 2,
						...INPUT_ANIMATION_CONFIG,
					}}
				/>
				<Typography variant='h6' component='div' gutterBottom>
					Function Demo
				</Typography>
				<TextField
					fullWidth
					label='Enter keywords to filter the list...'
					value={listSearchTerm}
					onChange={(e) => setListSearchTerm(e.target.value)}
					variant='standard'
					className='input-field'
					sx={{
						mb: 2,
						...INPUT_ANIMATION_CONFIG,
					}}
				/>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					found {count} matches in {listSearchTime.toFixed(2)} milliseconds
				</Typography>
				<List sx={{ maxHeight: '600px', overflow: 'auto' }}>
					{filteredItems.map((item, index) => (
						<ListItem
							className={styles.listItem}
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={item + index}
							sx={{
								transition: 'all 0.3s ease-in-out',
								'&:hover': { backgroundColor: 'action.hover' },
							}}
						>
							<ListItemText
								primary={
									<Typography sx={{ ...TEXT_ACTIVE_CONFIG }}>
										<LightedText text={item} ranges={rangeItems[index]} className='bg-yellow font-bold' />
									</Typography>
								}
							/>
							<span className={styles.deleteBtn}>
								<LinkWithIcon
									name={IconParkNames.delete}
									onClick={() => {
										setList(list.filter((i) => i !== item))
									}}
								/>
							</span>
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	)
}

export default memo(ListSearch)
