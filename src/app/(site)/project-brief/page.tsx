import { ProjectBrief } from '@/components/port/ProjectBrief'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

export const metadata = legacyMetadata('/project-brief')

export default function ProjectBriefPage() {
  return (
    <>
      <JsonLd data={legacyJsonLd('/project-brief')} />
      <ProjectBrief />
    </>
  )
}
