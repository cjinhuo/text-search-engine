import { Link } from '@mui/material'
import { memo, useMemo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import SnackTip from '../../components/SnackTip'
import { GITHUB_URL } from '../../config'
import { useStarNotification } from '../../hooks/useNotification'
interface Iprops {
	children?: ReactNode
}

const ShowTip: FC<Iprops> = () => {
	const { notificationState, duration, closeNotification } = useStarNotification()

	const tipsContent = useMemo(() => {
		return (
			<div>
				<p>
					Enjoying this project?{' '}
					<Link href={`${GITHUB_URL}?tab=readme-ov-file#text-search-engine`}>Give us a star!</Link>
				</p>
			</div>
		)
	}, [])
	return (
		<>
			<SnackTip content={tipsContent} state={notificationState} handleClose={closeNotification} duration={duration} />
		</>
	)
}
export default memo(ShowTip)
