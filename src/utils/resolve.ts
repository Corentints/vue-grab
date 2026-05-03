import { createSourceResolver, vueResolver } from 'element-source'

// Use only the Vue resolver to avoid false positives from other framework resolvers
export const { resolveElementInfo } = createSourceResolver({ resolvers: [vueResolver] })
