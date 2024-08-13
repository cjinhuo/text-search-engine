import { useEffect } from 'react'

export const useScrollTop = () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
}
