import { Container, CssBaseline, Grid2 as Grid, Link } from '@mui/material'
import type { SnackbarOrigin } from '@mui/material/Snackbar'
import react, { useMemo, useState } from 'react'
import * as TextSearchEngine from 'text-search-engine'
import ListSearch from '../../components/ListSearch'
import SnackTip from '../../components/SnackTip'
import { GITHUB_URL } from '../../config'
import { useNotifyStar } from '../../hooks/useNotifyStar'

window._TEXT_SEARCH_ENGINE_ = TextSearchEngine
interface State extends SnackbarOrigin {
	open: boolean
}
export default function Home() {
	const [notificState, setNotificState] = useState<State>({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	})
	const { open } = notificState
	const duration = useMemo(() => 1000 * 6, [])
	const openNotification = (newState: SnackbarOrigin) => {
		setNotificState({ ...newState, open: true })
	}
	useNotifyStar({ callback: openNotification, open })
	const tipsContent = useMemo(() => {
		return (
			<div>
				<p>
					Your support is our greatest power, if you think our program is not bad, help move your finger to point a
					praise!
				</p>
				<p>
					github url: <Link href={GITHUB_URL}>{GITHUB_URL}</Link>
				</p>
			</div>
		)
	}, [])
	return (
		<div>
			<CssBaseline />
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Container sx={{ mt: 4, mb: 4, flex: 1, maxWidth: '80vw!important', width: '100%' }}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 24, md: 12 }}>
							<ListSearch />
						</Grid>
					</Grid>
				</Container>
			</div>
			<SnackTip
				content={tipsContent}
				state={notificState}
				handleClose={() => {
					setNotificState({ ...notificState, open: false })
				}}
				duration={duration}
			/>
		</div>
	)
}
