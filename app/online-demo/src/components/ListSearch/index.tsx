import { Card, CardContent, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { INPUT_ANIMATION_CONFIG, TEXT_ACTIVE_CONFIG } from '../../config/index'
import { useDebounce } from '../../hooks/useDebounce'
import { useStyles } from '../../hooks/useStyles'
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
	const classes = useStyles()
	const [listSearchTerm, setListSearchTerm] = useState('')
	const [newItem, setNewItem] = useState('')
	const [filteredItems, setFilteredItems] = useState(list.filter((item) => !!item))
	const [listSearchTime, setListSearchTime] = useState(0)
	const debounceValue = useDebounce(listSearchTerm, 500)
	const [count, setCount] = useState(0)
	const [flag, setFlag] = useState(false)
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [rangeItems, setRangeItems] = useState<any>([])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const filtered = list.filter((item) => item.toLowerCase().includes(debounceValue.toLowerCase()))
		setFilteredItems(filtered)

		const tempArr = []

		if (debounceValue) {
			setCount(filtered.length)
			const startTime = performance.now()
			for (const item of filtered) {
				tempArr.push(getRanges(item, debounceValue))
			}
			const endTime = performance.now()
			setRangeItems([...tempArr])
			setListSearchTime(endTime - startTime)
		} else {
			setCount(0)
			setListSearchTime(0)
			setRangeItems([])
		}
		setFlag(!flag)
	}, [list, debounceValue])
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const getRanges: any = (text: string, kw: string) => {
		const ranges = window._TEXT_SEARCH_ENGINE_.search(text, kw)
		return ranges
	}
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
					className={`input-field ${classes.customTextField}`}
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
					className={`input-field ${classes.customTextField}`}
					sx={{
						mb: 2,
						...INPUT_ANIMATION_CONFIG,
					}}
				/>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					<span className='text-skin-neutral-5'>
						found {count} matches in {listSearchTime.toFixed(2)} milliseconds
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
				>
					{filteredItems.map((item, index) => (
						<ListItem
							className={`${styles.listItem} ${classes.customListItem}`}
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={item + index}
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
