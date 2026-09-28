import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

const ROUTES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map((r) => ({
    url: `${site.url}${r.path === '/' ? '' : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
