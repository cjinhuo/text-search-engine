import { pureSearch } from '../exports'

describe('pureSearch', () => {
	test('test isCharConsecutive option with Chinese', () => {
		const source = 'Model模型 Context上下文  Protocol协议'
		const pinyinMap = { 模: ['mo'], 型: ['xing'], 上: ['shang'], 下: ['xia'], 协: ['xie'], 文: ['wen'], 议: ['yi'] }
		const target = 'modelsx pr' // model上下 pr连续

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, {
			pinyinMap,
		})
		console.log('Search result with Chinese (without isCharConsecutive):', result1)
		expect(result1).not.toBeUndefined()

		// 传递 isCharConsecutive 的情况
		const result2 = pureSearch(source, target, {
			pinyinMap,
			isCharConsecutive: true,
		})
		console.log('Search result with Chinese (with isCharConsecutive):', result2)
		expect(result2).not.toBeUndefined()
	})

	test('test isCharConsecutive option with Chinese - discontinuous', () => {
		const source = 'Model模型 Context上下文  Protocol协议'
		const pinyinMap = { 模: ['mo'], 型: ['xing'], 上: ['shang'], 下: ['xia'], 协: ['xie'], 文: ['wen'], 议: ['yi'] }
		const target = 'modelsx po' // model上下 po不连续

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, {
			pinyinMap,
		})
		console.log('Search result with Chinese (discontinuous, without isCharConsecutive):', result1)
		expect(result1).not.toBeUndefined()

		// 传递 isCharConsecutive 的情况
		const result2 = pureSearch(source, target, {
			pinyinMap,
			isCharConsecutive: true,
		})
		console.log('Search result with Chinese (discontinuous, with isCharConsecutive):', result2)
		expect(result2).toBeUndefined()
	})

	test('test isCharConsecutive option with pure English - discontinuous', () => {
		const source = 'Model Context Protocol'
		const target = 'mod pro'

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, {
			pinyinMap: {},
		})
		console.log('Search result with pure English (without isCharConsecutive):', result1)
		expect(result1).not.toBeUndefined()

		// 传递 isCharConsecutive 的情况
		const result2 = pureSearch(source, target, {
			pinyinMap: {},
			isCharConsecutive: true,
		})
		console.log('Search result with pure English (with isCharConsecutive):', result2)
		expect(result2).not.toBeUndefined()
	})

	test('test isCharConsecutive option with mixed case', () => {
		const source = 'Model Context Protocol'
		const target = 'modpro' // 大小写混合的连续匹配

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, {
			pinyinMap: {},
		})
		console.log('Search result with mixed case (without isCharConsecutive):', result1)
		expect(result1).not.toBeUndefined()

		// 传递 isCharConsecutive 的情况
		const result2 = pureSearch(source, target, {
			pinyinMap: {},
			isCharConsecutive: true,
		})
		console.log('Search result with mixed case (with isCharConsecutive):', result2)
		expect(result2).toBeUndefined()
	})

	test('test isCharConsecutive option with single word', () => {
		const source = 'Model Context Protocol'
		const target = 'mo del'

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, {
			pinyinMap: {},
		})
		console.log('Search result with single word (without isCharConsecutive):', result1)
		expect(result1).not.toBeUndefined()

		// 传递 isCharConsecutive 的情况
		const result2 = pureSearch(source, target, {
			pinyinMap: {},
			isCharConsecutive: true,
		})
		console.log('Search result with single word (with isCharConsecutive):', result2)
		expect(result2).not.toBeUndefined()
	})

	test('test boundry case', () => {
		const source = '这是 测试 监控 Chinese Peo'
		const target = 'zcjChin P'
		const pinyinMap = { 这: ['zhe'], 是: ['shi'], 测: ['ce'], 监: ['jian'], 控: ['kong'] }

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, { pinyinMap })
		console.log('test boundry case(without isCharConsecutive):', result1)
		expect(result1).not.toBeUndefined()

		// 传递 isCharConsecutive 的情况
		const result2 = pureSearch(source, target, {
			pinyinMap,
			isCharConsecutive: true,
		})
		console.log('test boundry case(with isCharConsecutive):', result2)
		expect(result2).not.toBeUndefined()
	})

	test('test Chinese with special characters', () => {
		const source = '用户 Chinese People !'
		const target = '用户 chp !' // 匹配特殊字符和中文
		const pinyinMap = { 用: ['yong'], 户: ['hu'] }

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, { pinyinMap })
		console.log('test special chars case(without isCharConsecutive):', result1)
		expect(result1).not.toBeUndefined()

		// 传递 isCharConsecutive 的情况
		const result2 = pureSearch(source, target, {
			pinyinMap,
			isCharConsecutive: true,
		})
		console.log('test special chars case(with isCharConsecutive):', result2)
		expect(result2).toBeUndefined() // ch 和 p不连续
	})

	test('test Chinese with numbers and symbols', () => {
		const source = '服务器#1号机_测试环境chinese people (2023版)'
		const target = '#1 测试 chp23' // 匹配数字、特殊字符和中文拼音
		const pinyinMap = {
			服: ['fu'],
			务: ['wu'],
			器: ['qi'],
			号: ['hao'],
			机: ['ji'],
			测: ['ce'],
			试: ['shi'],
			环: ['huan'],
			境: ['jing'],
		}

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, { pinyinMap })
		console.log('test numbers and symbols case(without isCharConsecutive):', result1)
		expect(result1).not.toBeUndefined()

		// 传递 isCharConsecutive 的情况
		const result2 = pureSearch(source, target, {
			pinyinMap,
			isCharConsecutive: true,
		})
		console.log('test numbers and symbols case(with isCharConsecutive):', result2)
		expect(result2).toBeUndefined()
	})

	test('test special word', () => {
		const source = 'a_bc'
		const target = '_c'

		// 不传递 isCharConsecutive 的情况
		const result1 = pureSearch(source, target, {
			pinyinMap: {},
			isCharConsecutive: true,
		})
		expect(result1).toBeUndefined()
	})

	test('README example: scattered match', () => {
		const source = 'Chinese@中国 People-人'
		const target = 'chie'
		const result = pureSearch(source, target, { pinyinMap: {} })
		expect(result).not.toBeUndefined() // 普通模式下可以分散匹配
	})

	test('README example: consecutive match fail', () => {
		const source = 'Chinese@中国 People-人'
		const target = 'chie'
		const result = pureSearch(source, target, { pinyinMap: {}, isCharConsecutive: true })
		expect(result).toBeUndefined() // 连续模式下 'chi' 和 'e' 不连续，匹配失败
	})

	test('README example: consecutive match success with Chinese and English', () => {
		const source = 'Chinese@中国 People-人'
		const target = '中ple'
		const result = pureSearch(source, target, { pinyinMap: {}, isCharConsecutive: true })
		expect(result).not.toBeUndefined() // 连续模式下，中文和英文不要求连续，可以分别命中
	})

	test('test edge case', () => {
		const source = '你 Chinese'
		const target1 = 'n Chis'
		const result = pureSearch(source, target1, { pinyinMap: { 你: ['ni'] }, isCharConsecutive: true })
		expect(result).toBeUndefined()

		const target2 = '你 Chis'
		const result2 = pureSearch(source, target2, { pinyinMap: { 你: ['ni'] }, isCharConsecutive: true })
		expect(result2).toBeUndefined()

		const secondSource = 'Chinese 我 Chinese'
		const secondTarget = 'cese w'
		const secondResult = pureSearch(secondSource, secondTarget, { pinyinMap: { 我: ['wo'] }, isCharConsecutive: true })
		expect(secondResult).toBeUndefined()
	})

	test('test continuous word', () => {
		const source = 'Chinese中国 People人'
		const pinyinMap = { 中: ['zhong'], 国: ['guo'], 人: ['ren'] }
		const target = 'esezg 人'

		// 传递 isCharConsecutive 的情况
		const result = pureSearch(source, target, {
			pinyinMap,
			isCharConsecutive: true,
		})
		expect(result).not.toBeUndefined()
	})

	test('test continuous same word', () => {
		const source = '那 nah'
		const pinyinMap = { 那: ['na'] }
		const target = 'n nh'

		// 传递 isCharConsecutive 的情况
		const result = pureSearch(source, target, {
			pinyinMap,
			isCharConsecutive: true,
		})
		expect(result).toBeUndefined()
	})
})
