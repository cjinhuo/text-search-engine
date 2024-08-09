import { IconParkNames } from '../../shared/constants'
import LinkWithIcon from '../link-with-icon'
export default function HeaderRight() {
	return (
		<div className='h-full flex'>
			<LinkWithIcon name={IconParkNames.github} value='https://github.com/cjinhuo/text-search-engine' type='link' />
		</div>
	)
}
