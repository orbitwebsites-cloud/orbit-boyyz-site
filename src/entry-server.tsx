import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

// Re-export content so the prerender script can build routes + JSON-LD
// from a single source of truth.
export { blogPosts, faqs } from './App'

// Render a single route to a static HTML string. The prerender script
// injects this into the <div id="root"> of the built index.html template.
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}
