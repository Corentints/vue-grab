import type { ElementInfo } from 'element-source'

export interface PromptOptions {
  showLines?: boolean
  /** Custom prompt template. Use {{ variable }} placeholders — see README for available variables. */
  prompt?: string
}

export function generatePrompt(
  element: Element,
  info: ElementInfo,
  opts: PromptOptions = {},
): string {
  if (opts.prompt) {
    return interpolate(opts.prompt, buildVars(element, info))
  }

  const showLines = opts.showLines !== false
  const name = info.componentName ?? info.tagName
  const parts: string[] = []

  parts.push(`In my Vue app, I want to talk about the <${name}> component.`)
  parts.push('')

  if (info.source && showLines) {
    const { filePath, lineNumber } = info.source
    parts.push(`Component: ${info.componentName ?? name}`)
    parts.push(`File: ${filePath}${lineNumber != null ? `:${lineNumber}` : ''}`)
    parts.push('')
  } else if (info.source && !showLines) {
    parts.push(`Component: ${info.componentName ?? name}`)
    parts.push('')
  }

  parts.push('Element:')
  parts.push('```html')
  parts.push(getHTMLPreview(element))
  parts.push('```')

  if (info.stack.length > 1) {
    parts.push('')
    parts.push('Component stack:')
    for (const frame of info.stack) {
      const frameName = frame.componentName ?? '?'
      const loc =
        showLines && frame.lineNumber != null
          ? `${frame.filePath}:${frame.lineNumber}`
          : frame.filePath
      parts.push(`  in ${frameName} (at ${loc})`)
    }
  }

  return parts.join('\n')
}

function buildVars(element: Element, info: ElementInfo): Record<string, string> {
  const stackLines = info.stack.slice(1).map(frame => {
    const loc = frame.lineNumber != null ? `${frame.filePath}:${frame.lineNumber}` : frame.filePath
    return `  in ${frame.componentName ?? '?'} (at ${loc})`
  })

  return {
    component: info.componentName ?? info.tagName,
    file: info.source?.filePath ?? '',
    line: info.source?.lineNumber != null ? String(info.source.lineNumber) : '',
    html: getHTMLPreview(element),
    stack: stackLines.join('\n'),
  }
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => vars[key] ?? '')
}

function getHTMLPreview(element: Element): string {
  const tag = element.tagName.toLowerCase()

  const attrs = [...element.attributes]
    .filter(a => !a.name.startsWith('data-v-'))
    .map(a => {
      const val = a.value.length > 60 ? a.value.slice(0, 57) + '...' : a.value
      return ` ${a.name}="${val}"`
    })
    .join('')

  const childCount = element.children.length
  const text =
    (element instanceof HTMLElement ? element.innerText : element.textContent)?.trim() ?? ''
  const truncated = text.length > 80 ? text.slice(0, 77) + '...' : text

  if (childCount === 0) {
    return truncated ? `<${tag}${attrs}>${truncated}</${tag}>` : `<${tag}${attrs} />`
  }

  if (childCount <= 3) {
    const childLines = [...element.children].map(c => `  <${c.tagName.toLowerCase()} />`).join('\n')
    return `<${tag}${attrs}>\n${childLines}\n</${tag}>`
  }

  return `<${tag}${attrs}>\n  {/* ${childCount} children */}\n</${tag}>`
}
