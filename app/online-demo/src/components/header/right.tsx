import { GITHUB_URL } from '../../config'
import { IconParkNames } from '../../shared/constants'
import LightTooltip from '../LighTooltip'
import LinkWithIcon from '../link-with-icon'
import Theme from './theme'
export default function HeaderRight() {
	return (
		<div className='h-full flex' style={{ gap: '1.2rem' }}>
			<LightTooltip title='You can also access our API through the console. The instance is encapsulated in window._TEXT_SEARCH_ENGINE_'>
				<div className='flex items-center cursor-pointer'>
					<LinkWithIcon name={IconParkNames.tips} value={GITHUB_URL} type='link' />
				</div>
			</LightTooltip>
			<LinkWithIcon name={IconParkNames.github} value={GITHUB_URL} type='link' />
			<Theme />
		</div>
	)
}
