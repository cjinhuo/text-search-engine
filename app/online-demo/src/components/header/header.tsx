import styled from '@emotion/styled'
import HeaderLeft from './left'
import HeaderRight from './right'

const HeaderContainer = styled.div`
  padding-left: 5vw;
  padding-right: 5vw;
`
export default function Header() {
	return (
		<HeaderContainer className='w-full flex items-center justify-between h-10'>
			<HeaderLeft />
			<HeaderRight />
		</HeaderContainer>
	)
}
