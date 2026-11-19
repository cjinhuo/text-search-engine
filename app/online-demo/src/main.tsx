import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'

function resizeText() {
	const root = document.documentElement
	root.style.fontSize = `${Math.min(root.clientWidth / 30, 18)}px`
}
window.addEventListener('resize', resizeText)
resizeText()

const rootEl = document.getElementById('root')

if (rootEl) {
	const root = ReactDOM.createRoot(rootEl)
	root.render(<RouterProvider router={router} />)
}
