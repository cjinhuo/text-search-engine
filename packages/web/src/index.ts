import { coreAdd } from '@mono/core'
import { isString } from '@mono/shared'

export const webAdd = (a: number, b: number) => coreAdd(a, b)

export const webIsString = (param: unknown) => isString(param)
