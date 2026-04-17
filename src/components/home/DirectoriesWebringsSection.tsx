import { Globe, ExternalLink } from 'lucide-react'
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

const sites = reciprocalSites.sites as ReciprocalSite[]

// All directory partners (homepage hard-required + previously /links/) get
// surfaced on the home page now. Widgets stay in their own group.
const allDirectorySites = sites.filter(
  (s) =>
    s.phase_status === 'implement_now' &&
    !s.widget_required &&
    (s.route_target === 'homepage' || s.route_target === '/links/'),
)

const widgetSites = sites.filter(
  (s) =>
    s.phase_status === 'implement_now' &&
    s.route_target === 'homepage' &&
    s.widget_required,
)

type ReciprocalOverride = {
  href: string
  anchor: string
  title?: string
  suffix?: string
}

// Vendor-issued exact HTML for reciprocal validation. href / title / anchor
// must remain byte-identical to what the directory requires.
const RECIPROCAL_OVERRIDES: Record<string, ReciprocalOverride> = {
  'Play-Free-Online-Games': {
    href: 'http://play-free-online-games.com/',
    anchor: 'Free Online Games',
    suffix: ' - Hundreds of the best free online games!',
  },
  Viesearch: {
    href: 'https://viesearch.com/',
    anchor: 'Viesearch - The Human-curated Search Engine',
  },
  'World Web Directory': {
    href: 'https://www.worldweb-directory.com/',
    anchor: 'World Web Directory',
  },
  WebDirectoryBook: {
    href: 'https://www.webdirectorybook.com/index.html',
    anchor: 'Web Directory Book',
  },
  TXTLinks: {
    href: 'http://www.txtlinks.com',
    anchor: 'Free Links Directory',
  },
  GDirectory: {
    href: 'https://www.gdirectory.info/',
    anchor: 'Website Directory',
  },
  Saanvi: {
    href: 'http://www.saanvi.org',
    anchor: 'Saanvi Web Directory',
    suffix: ' - Human edited web directory.',
  },
  '101bookmarks': {
    href: 'http://www.101bookmarks.com/',
    title: 'SEO Friendly and Human Edited Link Directory',
    anchor: '101bookmarks.com - SEO Friendly and Human Edited Link Directory',
  },
  USAListingDirectory: {
    href: 'https://www.usalistingdirectory.com/index.php?list=top',
    anchor: 'Free Online Directory',
  },
  USAWebsitesDirectory: {
    href: 'http://www.usawebsitesdirectory.com/computers_and_internet/',
    anchor: 'http://www.usawebsitesdirectory.com/computers_and_internet/',
  },
}

// Display order: vendor-issued exact-HTML partners first (in the order the
// site owner provided), then any remaining plain-text partners.
const HOMEPAGE_DIRECTORY_ORDER: string[] = [
  'Play-Free-Online-Games',
  'Viesearch',
  'World Web Directory',
  'WebDirectoryBook',
  'TXTLinks',
  'GDirectory',
  'Saanvi',
  '101bookmarks',
  'USAListingDirectory',
  'USAWebsitesDirectory',
]

const orderedDirectorySites: ReciprocalSite[] = [
  ...HOMEPAGE_DIRECTORY_ORDER.map((name) =>
    allDirectorySites.find((s) => s.name === name),
  ).filter((s): s is ReciprocalSite => Boolean(s)),
  ...allDirectorySites.filter(
    (s) => !HOMEPAGE_DIRECTORY_ORDER.includes(s.name),
  ),
]

export default function DirectoriesWebringsSection() {
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
            Reciprocal Partners
          </h2>
        </div>

        {/* Reciprocal directory partners */}
        {orderedDirectorySites.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Directory Partners
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderedDirectorySites.map((site) => {
                const override = RECIPROCAL_OVERRIDES[site.name]

                if (override) {
                  return (
                    <li
                      key={site.name}
                      className="p-5 rounded-xl border border-border bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <h4 className="font-semibold mb-1">{site.name}</h4>
                      <p className="text-sm leading-relaxed">
                        <a
                          href={override.href}
                          title={override.title}
                          target="_blank"
                          rel="noopener"
                          className="text-[hsl(var(--nav-theme-light))] hover:underline underline-offset-4 break-words"
                        >
                          {override.anchor}
                        </a>
                        {override.suffix ? (
                          <span className="text-muted-foreground">
                            {override.suffix}
                          </span>
                        ) : null}
                      </p>
                    </li>
                  )
                }

                return (
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
                    <p className="text-xs text-muted-foreground">
                      {site.domain}
                    </p>
                  </li>
                )
              })}
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
