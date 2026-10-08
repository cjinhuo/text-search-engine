export interface Resource {
	id: string
	title: string
	description: string
	kind: string
	tags: string[]
	metadata: {
		host: string
		updatedAt: string
	}
	stats: { stars: number; contributors: number }
}

export const resources: readonly Resource[] = [
	{
		id: 'observability',
		title: '实时监控台',
		description: '统一查看服务性能、错误告警与链路数据。',
		kind: '应用',
		tags: ['React', 'TypeScript', 'Observability'],
		metadata: { host: 'github.com', updatedAt: '2026-09-18' },
		stats: { stars: 128, contributors: 12 },
	},
	{
		id: 'design-system',
		title: '星河设计系统',
		description: '可访问的高性能组件库，让产品界面保持一致。',
		kind: '组件库',
		tags: ['React', 'Accessibility', 'Figma'],
		metadata: { host: 'design.example.com', updatedAt: '2026-09-22' },
		stats: { stars: 256, contributors: 18 },
	},
	{
		id: 'typescript-guide',
		title: 'TypeScript 实战指南',
		description: '从泛型推导到复杂对象建模，掌握类型安全的开发方式。',
		kind: '文档',
		tags: ['TypeScript', 'Generics', 'Learning'],
		metadata: { host: 'typescriptlang.org', updatedAt: '2026-09-15' },
		stats: { stars: 92, contributors: 5 },
	},
	{
		id: 'knowledge-base',
		title: '团队知识库',
		description: '汇集技术方案、会议记录与新人入职手册。',
		kind: '应用',
		tags: ['Vue', 'Markdown', 'Collaboration'],
		metadata: { host: 'wiki.example.com', updatedAt: '2026-09-20' },
		stats: { stars: 64, contributors: 9 },
	},
	{
		id: 'release-pipeline',
		title: '自动化发布流水线',
		description: '连接代码审查、构建和部署，追踪每一次版本发布。',
		kind: '工具',
		tags: ['Node.js', 'CI/CD', 'Docker'],
		metadata: { host: 'gitlab.com', updatedAt: '2026-09-12' },
		stats: { stars: 87, contributors: 8 },
	},
	{
		id: 'analytics',
		title: '用户行为分析',
		description: '探索转化漏斗与留存趋势，用数据理解产品体验。',
		kind: '应用',
		tags: ['Python', 'SQL', 'Analytics'],
		metadata: { host: 'analytics.example.com', updatedAt: '2026-09-25' },
		stats: { stars: 73, contributors: 6 },
	},
	{
		id: 'search-sdk',
		title: '拼音搜索实验室',
		description: '探索中英文混合搜索、模糊匹配与高亮范围。',
		kind: 'SDK',
		tags: ['TypeScript', 'Pinyin', 'Search'],
		metadata: { host: 'npmjs.com', updatedAt: '2026-09-28' },
		stats: { stars: 156, contributors: 4 },
	},
	{
		id: 'api-playground',
		title: 'API 调试工作台',
		description: '保存请求集合，在浏览器中验证接口响应与鉴权流程。',
		kind: '工具',
		tags: ['REST', 'GraphQL', 'Testing'],
		metadata: { host: 'api.example.com', updatedAt: '2026-09-16' },
		stats: { stars: 45, contributors: 7 },
	},
]

// 嵌套属性和数组先转换为字符串；返回键就是 fieldHitRanges 的字段名。
export const getResourceFields = (item: Resource) => ({
	title: item.title,
	description: item.description,
	tags: item.tags.join(' · '),
	host: item.metadata.host,
})

export type ResourceField = keyof ReturnType<typeof getResourceFields>

export const fieldDefinitions: { key: ResourceField; label: string; path: string }[] = [
	{ key: 'title', label: '标题', path: 'title' },
	{ key: 'description', label: '描述', path: 'description' },
	{ key: 'tags', label: '标签', path: 'tags[]' },
	{ key: 'host', label: '域名', path: 'metadata.host' },
]

export const queryExamples = [
	{ query: 'type ss', label: '多个结果' },
	{ query: '性n react', label: '两个结果' },
	{ query: 'jk github', label: '一个结果' },
]
