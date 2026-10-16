import { SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
const isDevelopment = process.env.NODE_ENV === 'development'

function missingConfigurationMessage(variableName: string) {
  return `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
}

export const posthogLogProvider = projectToken && posthogHost
  ? new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'orbitboyzz-nextjs' }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ],
    })
  : null

const websiteCheckLogger = posthogLogProvider?.getLogger('posthog.website-check')

type WebsiteCheckLogAttributes = Record<string, boolean | number | string>

export function logWebsiteCheckCompleted(attributes: WebsiteCheckLogAttributes) {
  websiteCheckLogger?.emit({
    body: 'website check completed',
    severityNumber: SeverityNumber.INFO,
    attributes: { event: 'website_check_completed', ...attributes },
  })
}

export function logWebsiteCheckRejected(attributes: WebsiteCheckLogAttributes) {
  websiteCheckLogger?.emit({
    body: 'website check rejected',
    severityNumber: SeverityNumber.WARN,
    attributes: { event: 'website_check_rejected', ...attributes },
  })
}

export function logWebsiteCheckFailed(attributes: WebsiteCheckLogAttributes) {
  websiteCheckLogger?.emit({
    body: 'website check failed',
    severityNumber: SeverityNumber.ERROR,
    attributes: { event: 'website_check_failed', ...attributes },
  })
}

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  if (!projectToken) {
    if (isDevelopment) throw new Error(missingConfigurationMessage('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'))
    return
  }

  if (!posthogHost) {
    if (isDevelopment) throw new Error(missingConfigurationMessage('NEXT_PUBLIC_POSTHOG_HOST'))
  }
}
