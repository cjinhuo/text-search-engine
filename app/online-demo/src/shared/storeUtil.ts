class storeUtil {
	private static instance: storeUtil

	private constructor() {}

	public static getInstance(): storeUtil {
		if (!storeUtil.instance) {
			storeUtil.instance = new storeUtil()
		}
		return storeUtil.instance
	}

	set(key: string, value: string | number, expireSecond?: number): void {
		if (expireSecond !== undefined) {
			const expiry = new Date().getTime() + expireSecond * 1000
			const item = {
				value: value,
				expiry,
			}
			localStorage.setItem(key, JSON.stringify(item))
		} else {
			localStorage.setItem(key, JSON.stringify(value))
		}
	}

	get(key: string): string | null {
		const itemStr = localStorage.getItem(key)
		if (!itemStr) {
			return null
		}

		try {
			const item = JSON.parse(itemStr)
			if (item.expiry && typeof item.expiry === 'number') {
				const now = new Date().getTime()
				if (now > item.expiry) {
					this.remove(key)
					return null
				}
				return item.value
			}
		} catch (e) {
			return itemStr
		}

		return JSON.parse(itemStr)
	}

	remove(key: string): void {
		localStorage.removeItem(key)
	}

	clear(): void {
		localStorage.clear()
	}
}

export default storeUtil.getInstance()
