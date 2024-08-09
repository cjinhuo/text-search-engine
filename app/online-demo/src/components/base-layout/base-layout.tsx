import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './base-layout.css'

import styled from '@emotion/styled'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../footer'
import Header from '../header/header'

const ContentContainer = styled.div`
  padding: 3vh 4vw;
`
function BaseLayout() {
	return (
		<>
			<Header />
			<ContentContainer className='w-full grow'>
				<Outlet />
			</ContentContainer>
			<Footer />
		</>
	)
}
export default React.memo(BaseLayout)
