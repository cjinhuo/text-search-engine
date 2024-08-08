import { useState } from 'react'

import { coreAdd, coreIsString } from '@mono/core'

export default function TestCore() {
	const [count, setCount] = useState(0)
	const [str] = useState('str')
	const [num] = useState(-1)
	return (
		<div>
			<div>
				<button type='button' id='test-core-button' onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				{count} + {count} = <span id='test-core-result'>{coreAdd(count, count)}</span>
			</div>
			<div id='test-core-string'>
				{str} is
				{coreIsString(str) ? ' string' : ' non-string'}
			</div>
			<div id='test-core-non-string'>
				{num} is
				{coreIsString(num) ? ' string' : ' non-string'}
			</div>
		</div>
	)
}
