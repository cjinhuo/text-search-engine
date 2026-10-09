import styled from '@emotion/styled'
import HeaderLeft from './left'
import HeaderRight from './right'

const HeaderContainer = styled.div`
  padding-left: 5vw;
  padding-right: 5vw;
  min-height: 2.5rem;
  height: auto;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 1rem;
`
export default function Header() {
	return (
		<HeaderContainer className='w-full flex items-center justify-between'>
			<HeaderLeft />
			<HeaderRight />
		</HeaderContainer>
	)
}
