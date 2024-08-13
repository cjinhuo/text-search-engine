import { GITHUB_URL } from '../../config'
import { IconParkNames } from '../../shared/constants'
import LinkWithIcon from '../link-with-icon'
import Theme from './theme'
export default function HeaderRight() {
	return (
		<div className='h-full flex'>
			<LinkWithIcon name={IconParkNames.github} value={GITHUB_URL} type='link' />
			<Theme />
		</div>
	)
}
