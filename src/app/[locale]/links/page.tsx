import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import reciprocalSites from '@/data/reciprocal_sites.json'

interface Props {
  params: Promise<{ locale: string }>
}

interface ReciprocalSite {
  name: string
  domain: string
  phase_status: string
  fit_status: string
  type: string
  route_target: string
  homepage_required_by_vendor: boolean
  homepage_required_by_local_policy: boolean
  static_page_required: boolean
  widget_required: boolean
  exact_html_required: boolean
  review_mode: string
  submission_mode: string
  code_source_status: string
  requirement_summary: string
  verification_summary: string
  notes: string
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thedivisionresurgence.wiki'
  const path = '/links'

  return {
    title: 'Resource Links & Partner Directories - The Division Resurgence Wiki',
    description: 'Curated list of partner directories, gaming portals, and web resources related to The Division Resurgence Wiki. Explore fellow game sites, webrings, and community hubs.',
    keywords: [
      'The Division Resurgence partners',
      'gaming directories',
      'game webring',
      'mobile game resources',
      'partner links',
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'The Division Resurgence Wiki',
      title: 'Resource Links & Partner Directories',
      description: 'Curated partner directories and resource hubs related to The Division Resurgence Wiki.',
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

const sites = reciprocalSites.sites as ReciprocalSite[]

const linksPageSites = sites.filter(
  (s) => s.phase_status === 'implement_now' && s.route_target === '/links/',
)

const exactHtmlSites = linksPageSites.filter((s) => s.exact_html_required)
const plainTextSites = linksPageSites.filter((s) => !s.exact_html_required)

function SiteCard({ site }: { site: ReciprocalSite }) {
  const href = `https://${site.domain}`
  return (
    <li className="p-5 rounded-xl border border-border bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-base">
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="hover:text-[hsl(var(--nav-theme-light))] hover:underline underline-offset-4"
          >
            {site.name}
          </a>
        </h3>
        {site.exact_html_required && (
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
            exact code pending
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="hover:text-[hsl(var(--nav-theme-light))]"
        >
          {site.domain}
        </a>
      </p>
    </li>
  )
}

export default async function LinksPage({ params }: Props) {
  const { locale } = await params
  const homeHref = locale === 'en' ? '/' : `/${locale}`

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative py-16 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Resource Links & Partner Directories
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A hand-picked list of gaming directories, webrings, and resource
            hubs we link out to. These are fellow sites that cover games, agent
            culture, or general web resources.
          </p>
        </div>
      </section>

      {/* Plain text partner directories */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <header className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Partner Directories & Game Portals
            </h2>
          </header>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plainTextSites.map((site) => (
              <SiteCard key={site.name} site={site} />
            ))}
          </ul>
        </div>
      </section>

      {/* Exact HTML pending group */}
      {exactHtmlSites.length > 0 && (
        <section className="px-4 py-12 bg-white/[0.02] border-t border-border">
          <div className="container mx-auto max-w-5xl">
            <header className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                Reciprocal Directories (Exact-Code Slot)
              </h2>
            </header>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exactHtmlSites.map((site) => (
                <SiteCard key={site.name} site={site} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* About this page */}
      <section className="px-4 py-12 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>About This Page</h2>
            <p>
              The Division Resurgence Wiki is an unofficial fan resource. This
              page lists external directories and webrings that we have
              reciprocal relationships with or consider relevant to our
              audience. All links here are plain <code>&lt;a href&gt;</code>{' '}
              anchors so they remain visible and crawlable.
            </p>
            <p>
              Some partners (marked as <em>exact code pending</em>) require a
              specific HTML snippet provided at submission time. Those entries
              currently use a normal reciprocal text link and will be swapped
              for the vendor-supplied snippet once issued.
            </p>
            <p className="text-sm text-muted-foreground">
              Want your directory or webring added? Email{' '}
              <a
                href="mailto:partnerships@thedivisionresurgence.wiki"
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                partnerships@thedivisionresurgence.wiki
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Link
            href={homeHref}
            className="text-[hsl(var(--nav-theme-light))] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
