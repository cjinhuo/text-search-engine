import { createBrowserRouter } from 'react-router-dom'
import BaseLayout from '../components/base-layout/base-layout'
import Home from '../pages/home/home'
const router = createBrowserRouter([
	{
		path: '/',
		element: <BaseLayout />,
		children: [
			{
				index: true,
				path: '/search-engine',
				element: <Home />,
			},
		],
	},
])

export default router
