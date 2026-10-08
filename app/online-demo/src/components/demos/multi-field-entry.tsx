import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { ArrowRight, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MultiFieldEntry() {
	return (
		<Card variant='outlined' sx={{ mb: 3, borderColor: '#a4cebb', borderRadius: 3 }}>
			<CardActionArea component={Link} to='/text-search-engine/multi-field' aria-label='打开多字段 Demo'>
				<CardContent
					sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, p: 3, '&:last-child': { pb: 3 } }}
				>
					<Layers3 size={30} color='#16795b' />
					<div style={{ flex: 1, minWidth: 180 }}>
						<Typography variant='h6'>对象数组也能搜索：体验多字段匹配</Typography>
						<Typography variant='body2' color='text.secondary'>
							标题、描述、标签数组、嵌套属性，一次查询，逐字段高亮。
						</Typography>
					</div>
					<span
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							color: '#16795b',
							fontSize: 14,
							fontWeight: 600,
							textDecoration: 'none',
						}}
					>
						打开多字段 Demo <ArrowRight size={16} />
					</span>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
