import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-10 sm:sticky sm:top-0 sm:z-10 sm:backdrop-blur-lg sm:backdrop-saturate-150 sm:backdrop-filter">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between">
                <div className="mr-4 h-12 w-12 fill-primary-400 transition-colors first-letter:font-medium hover:fill-primary-600 dark:fill-primary-200 dark:hover:fill-primary-600">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="h-6 text-xl font-extralight tracking-widest sm:text-2xl">
                    <span className="font-mono font-bold">
                      {siteMetadata.headerTitle.split('.')[0] + '.'}
                    </span>
                    <span>{siteMetadata.headerTitle.split('.')[1]}</span>
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 transition-colors dark:text-gray-100 dark:hover:text-primary-300 sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
