import { webAdd } from '@mono/web'

export const reactAdd = (a: number, b: number) => a + webAdd(a, b) + 2
