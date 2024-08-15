import styled from '@emotion/styled'
import { IconParkNames } from '../../shared/constants'
import LinkWithIcon from '../link-with-icon'
import Logo from './logo'

const HeaderMenuContainer = styled.nav`
  display: flex;
  margin-left: 1rem;
  > div {
    margin-right: 2.2rem;
  }
`

const HeaderMenu = () => {
	return (
		<HeaderMenuContainer>
			<LinkWithIcon name={IconParkNames.info} />
		</HeaderMenuContainer>
	)
}
export default function HeaderLeft() {
	return (
		<div className='h-full flex justify-start'>
			<Logo />
		</div>
	)
}
