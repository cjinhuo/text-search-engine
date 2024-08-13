import { createBrowserRouter } from 'react-router-dom'
import BaseLayout from '../components/base-layout/base-layout'
import Home from '../pages/home'
const router = createBrowserRouter([
	{
		path: '/',
		element: <BaseLayout />,
		children: [
			{
				index: true,
				path: '/text-search-engine',
				element: <Home />,
			},
			{
				path: '/text-search-engine/:searchKey',
				element: <Home />,
			},
		],
	},
])

export default router
