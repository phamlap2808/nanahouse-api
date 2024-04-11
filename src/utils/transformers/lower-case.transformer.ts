import { TransformFnParams } from 'class-transformer/types/interfaces'
import type { Maybe } from '@/utils/define/maybe'

export const lowerCaseTransformer = (params: TransformFnParams): Maybe<string> => params.value?.toLowerCase().trim()
