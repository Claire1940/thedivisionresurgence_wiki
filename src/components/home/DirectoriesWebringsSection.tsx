import { Globe, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import reciprocalSites from '@/data/reciprocal_sites.json'

interface ReciprocalSite {
  name: string
  domain: string
  phase_status: string
  type: string
  route_target: string
  homepage_required_by_vendor: boolean
  homepage_required_by_local_policy: boolean
  static_page_required: boolean
  widget_required: boolean
  exact_html_required: boolean
  code_source_status: string
  notes: string
}

interface Props {
  locale: string
}

const sites = reciprocalSites.sites as ReciprocalSite[]

const homepageSites = sites.filter(
  (s) => s.phase_status === 'implement_now' && s.route_target === 'homepage',
)

const indexRequiredSites = homepageSites.filter(
  (s) =>
    !s.widget_required &&
    (s.homepage_required_by_vendor || s.homepage_required_by_local_policy),
)

const widgetSites = homepageSites.filter((s) => s.widget_required)

export default function DirectoriesWebringsSection({ locale }: Props) {
  const linksHref = locale === 'en' ? '/links' : `/${locale}/links`

  return (
    <section
      id="directories-webrings"
      className="scroll-mt-24 px-4 py-20 bg-white/[0.02] border-t border-border"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
            <Globe className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
            <span className="text-xs font-medium text-[hsl(var(--nav-theme-light))] uppercase tracking-wider">
              Directories & Webrings
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Partners featured on this home page
          </h2>
          <p className="text-muted-foreground text-base max-w-3xl mx-auto">
            A small set of partner directories and webrings that specifically
            require a home page link or a dedicated widget slot. For the full
            list of resource partners, see our{' '}
            <Link
              href={linksHref}
              className="text-[hsl(var(--nav-theme-light))] hover:underline"
            >
              resource links page
            </Link>
            .
          </p>
        </div>

        {/* Index-required text links */}
        {indexRequiredSites.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Directory Partners
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indexRequiredSites.map((site) => (
                <li
                  key={site.name}
                  className="p-5 rounded-xl border border-border bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold">
                      <a
                        href={`https://${site.domain}`}
                        target="_blank"
                        rel="noopener"
                        className="hover:text-[hsl(var(--nav-theme-light))] hover:underline underline-offset-4 inline-flex items-center gap-1.5"
                      >
                        {site.name}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {site.domain}
                  </p>
                  <p className="text-sm text-muted-foreground">{site.notes}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Widget / counter placeholder slots */}
        {widgetSites.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Widget & Counter Slots
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {widgetSites.map((site) => {
                const snippetPending =
                  site.code_source_status === 'external_snippet_needed'
                return (
                  <li
                    key={site.name}
                    data-reciprocal-widget={site.name
                      .replace(/\s+/g, '-')
                      .toLowerCase()}
                    data-snippet-status={site.code_source_status}
                    className="p-5 rounded-xl border border-dashed border-border bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold">
                        <a
                          href={`https://${site.domain}`}
                          target="_blank"
                          rel="noopener"
                          className="hover:text-[hsl(var(--nav-theme-light))] hover:underline underline-offset-4 inline-flex items-center gap-1.5"
                        >
                          {site.name}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </h4>
                      {snippetPending && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                          snippet pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {site.domain}
                    </p>
                    {/* Reserved slot for vendor-supplied widget / counter / vote button.
                        Do not inject third-party markup here unless issued by the vendor. */}
                    <div
                      className="min-h-[72px] flex items-center justify-center rounded-lg border border-border bg-background/50 text-xs text-muted-foreground text-center px-3"
                      aria-label={`${site.name} widget slot`}
                    >
                      Widget slot reserved · awaits vendor-issued code
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {site.notes}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
