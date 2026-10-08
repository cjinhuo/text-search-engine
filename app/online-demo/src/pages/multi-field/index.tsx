import { ArrowLeft, ArrowRight, Check, Database, Layers3, Search, X } from 'lucide-react'
import { type CSSProperties, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createSearcher, type Matrix, type SearchItemResult } from 'text-search-engine'
import { HighlightWithRanges } from 'text-search-engine/react'
import styles from './multi-field.module.css'
import {
	fieldDefinitions,
	getResourceFields,
	queryExamples,
	type Resource,
	type ResourceField,
	resources,
} from './resources'

const containerStyle: CSSProperties = {
	display: 'block',
	fontSize: 'inherit',
	fontWeight: 'inherit',
	whiteSpace: 'normal',
	overflow: 'visible',
}
const normalStyle: CSSProperties = { display: 'inline', color: 'inherit', whiteSpace: 'normal', overflow: 'visible' }
const highlightStyle: CSSProperties = {
	display: 'inline',
	whiteSpace: 'normal',
}

function FieldText({ source, ranges }: { source: string; ranges: Matrix }) {
	return (
		<HighlightWithRanges
			source={source}
			hitRanges={ranges}
			containerStyle={containerStyle}
			normalStyle={normalStyle}
			highlightStyle={highlightStyle}
		/>
	)
}

export default function MultiFieldPage() {
	const [query, setQuery] = useState(queryExamples[0].query)
	const [selectedFields, setSelectedFields] = useState<ResourceField[]>(fieldDefinitions.map(({ key }) => key))
	const [inspectedId, setInspectedId] = useState(resources[0].id)
	const [inspectionTab, setInspectionTab] = useState<'object' | 'ranges'>('object')
	const searcher = useMemo(
		() =>
			createSearcher(resources, {
				getFields: (item) => {
					const fields = getResourceFields(item)
					for (const { key } of fieldDefinitions) {
						if (!selectedFields.includes(key)) fields[key] = ''
					}
					return fields
				},
			}),
		[selectedFields]
	)
	const hasQuery = Boolean(query.trim())
	// 空查询由界面展示原始列表，SDK 的空查询结果为 []。
	const results: SearchItemResult<Resource, ResourceField>[] = hasQuery
		? searcher.search(query)
		: resources.map((item, index) => ({
				item,
				index,
				text: Object.values(getResourceFields(item)).join(''),
				hitRanges: [],
				fieldHitRanges: { title: [], description: [], tags: [], host: [] },
			}))
	const inspected = results.find(({ item }) => item.id === inspectedId) ?? results[0]
	const toggleField = (key: ResourceField) =>
		setSelectedFields((current) =>
			current.includes(key) ? current.filter((field) => field !== key) : [...current, key]
		)

	return (
		<main className={styles.page}>
			<Link className={styles.backLink} to='/text-search-engine'>
				<ArrowLeft size={15} /> 字符串数组 Demo
			</Link>
			<section className={styles.hero} aria-labelledby='multi-field-title'>
				<div>
					<div className={styles.eyebrow}>
						<Layers3 size={16} /> MULTI-FIELD SEARCH
					</div>
					<h1 id='multi-field-title'>一条查询，匹配整个对象。</h1>
					<p>标题、描述、标签数组和嵌套属性，都可以参与同一次匹配，并在各自字段中高亮。</p>
					<div className={styles.features}>
						<span>中英文 & 拼音</span>
						<span>跨字段组合匹配</span>
						<span>React 高亮组件</span>
					</div>
				</div>
			</section>

			<section className={styles.searchPanel} aria-label='多字段搜索体验'>
				<label htmlFor='resource-query' className={styles.inputLabel}>
					搜索资源目录
				</label>
				<div className={styles.inputWrap}>
					<Search size={22} aria-hidden='true' />
					<input
						id='resource-query'
						type='search'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder='试试：type ss、性n react、jk github'
						autoComplete='off'
					/>
					{query && (
						<button type='button' aria-label='清空搜索' onClick={() => setQuery('')}>
							<X size={18} />
						</button>
					)}
				</div>
				<div className={styles.examples}>
					<span>试一试</span>
					{queryExamples.map((example) => (
						<button
							type='button'
							key={example.query}
							className={query === example.query ? styles.activeExample : ''}
							onClick={() => setQuery(example.query)}
						>
							<code>{example.query}</code>
							<span>{example.label}</span>
						</button>
					))}
				</div>
				<div className={styles.scope}>
					<span>搜索范围</span>
					<div className={styles.fieldButtons}>
						{fieldDefinitions.map(({ key, label, path }) => (
							<button
								type='button'
								key={key}
								aria-pressed={selectedFields.includes(key)}
								title={path}
								onClick={() => toggleField(key)}
							>
								{selectedFields.includes(key) && <Check size={13} />} {label}
							</button>
						))}
					</div>
					<button
						type='button'
						className={styles.resetFields}
						onClick={() => setSelectedFields(fieldDefinitions.map(({ key }) => key))}
					>
						全部字段
					</button>
				</div>
				<p className={styles.searchNote}>空格组合关键词，可跨字段匹配；支持拼音和单词跨边界，默认不区分大小写。</p>
			</section>

			<div className={styles.resultsHeading}>
				<h2>
					匹配结果{' '}
					<span>
						{results.length} / {resources.length}
					</span>
				</h2>
				<output aria-live='polite'>
					{hasQuery ? `找到 ${results.length} 个资源 · 已选 ${selectedFields.length} 个字段` : '空输入，展示全部资源'}
				</output>
			</div>
			<div className={styles.resultLayout}>
				<section className={styles.resourceList} aria-label='资源列表'>
					{results.map(({ item, fieldHitRanges }) => {
						const fields = getResourceFields(item)
						const matchedFields = fieldDefinitions.filter(({ key }) => fieldHitRanges[key].length > 0)
						return (
							<article
								key={item.id}
								className={`${styles.resourceCard} ${inspected?.item.id === item.id ? styles.inspectedCard : ''}`}
							>
								<div className={styles.cardTop}>
									<span className={styles.kind}>{item.kind}</span>
									<span className={styles.cardId}>{item.id}</span>
								</div>
								<h3>
									<FieldText source={fields.title} ranges={fieldHitRanges.title} />
								</h3>
								<div className={styles.description}>
									<FieldText source={fields.description} ranges={fieldHitRanges.description} />
								</div>
								<dl className={styles.fieldRows}>
									{fieldDefinitions.slice(2).map(({ key, label }) => (
										<div key={key} data-field={key}>
											<dt>{label}</dt>
											<dd>
												<FieldText source={fields[key]} ranges={fieldHitRanges[key]} />
											</dd>
										</div>
									))}
								</dl>
								<div className={styles.cardBottom}>
									<div className={styles.matchBadges}>
										{matchedFields.map(({ key, label }) => (
											<span key={key}>{label}命中</span>
										))}
										{!hasQuery && <span className={styles.neutralBadge}>原始对象</span>}
									</div>
									<button
										type='button'
										aria-label={`查看 ${item.title} 的对象与范围`}
										aria-pressed={inspected?.item.id === item.id}
										onClick={() => setInspectedId(item.id)}
									>
										查看数据 <ArrowRight size={14} />
									</button>
								</div>
							</article>
						)
					})}
					{results.length === 0 && (
						<div className={styles.emptyState}>
							<Search size={30} />
							<h3>{selectedFields.length ? '没有匹配的资源' : '请选择搜索字段'}</h3>
							<p>
								{selectedFields.length ? '换个关键词，或开启更多字段再试试。' : '上方字段按钮可以随时调整搜索范围。'}
							</p>
							<button
								type='button'
								onClick={() => {
									setQuery('')
									setSelectedFields(fieldDefinitions.map(({ key }) => key))
								}}
							>
								重置搜索
							</button>
						</div>
					)}
				</section>
				<aside className={styles.inspector} aria-label='数据与匹配范围'>
					<div className={styles.inspectorHeading}>
						<Database size={16} />
						<h2>对象与匹配范围</h2>
					</div>
					<p>查看当前结果的原始对象与各字段高亮范围。</p>
					{inspected ? (
						<>
							<fieldset className={styles.inspectionTabs}>
								<legend className='sr-only'>数据检查方式</legend>
								<button
									id='object-tab'
									type='button'
									aria-pressed={inspectionTab === 'object'}
									aria-controls='inspection-panel'
									onClick={() => setInspectionTab('object')}
								>
									原始对象
								</button>
								<button
									id='ranges-tab'
									type='button'
									aria-pressed={inspectionTab === 'ranges'}
									aria-controls='inspection-panel'
									onClick={() => setInspectionTab('ranges')}
								>
									匹配范围
								</button>
							</fieldset>
							<section
								id='inspection-panel'
								aria-label={inspectionTab === 'object' ? '原始资源对象' : 'SDK 匹配范围'}
								className={styles.json}
							>
								<pre>
									{JSON.stringify(
										inspectionTab === 'object'
											? inspected.item
											: !hasQuery
												? []
												: {
														index: inspected.index,
														text: inspected.text,
														hitRanges: inspected.hitRanges,
														fieldHitRanges: inspected.fieldHitRanges,
													},
										null,
										2
									)}
								</pre>
							</section>
							<p className={styles.inspectionNote}>
								{inspectionTab === 'object'
									? `正在查看：${inspected.item.title}`
									: hasQuery
										? '范围使用闭区间 [start, end]；fieldHitRanges 是字段内坐标，未命中的字段为 []。'
										: '空查询时 SDK 返回 []，当前列表由界面展示原始对象。'}
							</p>
						</>
					) : (
						<p className={styles.inspectionNote}>搜索有结果时，在这里查看原始对象和返回范围。</p>
					)}
				</aside>
			</div>
		</main>
	)
}
