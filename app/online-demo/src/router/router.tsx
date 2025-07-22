import { createBrowserRouter } from 'react-router-dom'
import BaseLayout from '../components/base-layout/base-layout'
import Home from '../pages/home'
import Visual from '../pages/visual'

const router = createBrowserRouter([
	{
		path: '/',
		element: <BaseLayout />,
		children: [
			{
				path: '/text-search-engine',
				element: <Home />,
			},
			{
				path: '/text-search-engine/visual',
				element: <Visual />,
			},
		],
	},
])

export default router
