import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import type { Blog } from 'contentlayer/generated'
import { allBlogs } from 'contentlayer/generated'
import { InferGetStaticPropsType } from 'next'
import { NewsletterForm } from 'pliny/ui/NewsletterForm'
import { allCoreContent, sortedBlogPost } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'

import PerlinNoiseCanvas from '@/components/PerlinNoiseCanvas'
// import dynamic from 'next/dynamic'
// const PerlinNoiseCanvas = dynamic(
//   () => import('@/components/PerlinNoiseCanvas').then((mod) => mod.default),
//   {
//     ssr: false,
//   }
// )

const MAX_DISPLAY = 5

export const getStaticProps = async () => {
  const sortedPosts = sortedBlogPost(allBlogs) as Blog[]
  const posts = allCoreContent(sortedPosts)

  return { props: { posts } }
}

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <div>
            <div className="mb-16 flex flex-auto flex-wrap justify-center gap-4">
              <div className="min-w-0 max-w-sm">
                <h1 className="mb-2 text-left text-3xl font-extrabold leading-9 tracking-tight text-blue-500 dark:text-blue-200 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
                  Hi, I'm Lukas - welcome to my blog.
                </h1>
                <div className="introductionParagraphParent text-gray-500 dark:text-gray-400">
                  <p>
                    I'm a <strong>self-taught web developer</strong> and an aspiring entrepreneur /{' '}
                    <a
                      className="textLink"
                      href="https://www.indiehackers.com/about"
                      target="_blank"
                      rel="noreferrer"
                    >
                      indie hacker
                    </a>
                    .
                  </p>
                  <p>
                    I'm passionate about creating intuitive tools and startup communities - check
                    out my{' '}
                    <Link href={`/projects`} className="textLink">
                      projects
                    </Link>
                    .
                  </p>
                  <p>
                    I'm also interested in philosophy, AI and the future of automation (
                    <Link href={`/about`} className="textLink">
                      read more
                    </Link>{' '}
                    about me).
                  </p>
                  <p>
                    If you'd like to share anything at all - feel free to get in touch via{' '}
                    <Link href={`mailto:${siteMetadata.email}`} className="textLink">
                      email
                    </Link>{' '}
                    or{' '}
                    <Link href={siteMetadata.linkedin} className="textLink">
                      LinkedIn
                    </Link>
                    !
                  </p>
                </div>
              </div>
              <div className="h-[380px] w-[430px] overflow-hidden">
                <PerlinNoiseCanvas />
              </div>
            </div>
          </div>
          <h1 className="text-xl font-extrabold leading-9 tracking-tight text-gray-500 dark:text-gray-400 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            Latest posts
          </h1>
          {siteMetadata.description && (
            <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
              {siteMetadata.description}
            </p>
          )}
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && <p className="mt-2">No posts yet :)</p>}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter.provider && (
        <div className="flex items-center justify-center pt-10 sm:scale-[0.85]">
          <NewsletterForm
            title="Get informed about latest projects"
            // apiUrl="http://eepurl.com/icv8br"
          />
        </div>
      )}
    </>
  )
}
