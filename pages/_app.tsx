import '@/css/prism.css'
import '@/css/tailwind.css'
import 'katex/dist/katex.css'

import '@/css/docsearch.css'
import '@docsearch/css'

import '@fontsource/inter/variable-full.css'

import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import siteMetadata from '@/data/siteMetadata'
// import { Analytics } from 'pliny/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { SearchProvider } from 'pliny/search'

import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {/* <Analytics analyticsConfig={siteMetadata.analytics} /> */}
      <SearchProvider searchConfig={siteMetadata.search}>
        <LayoutWrapper>
          <Component {...pageProps} />
          <Analytics />
        </LayoutWrapper>
      </SearchProvider>
    </ThemeProvider>
  )
}
