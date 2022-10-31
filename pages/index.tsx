import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { sortedBlogPost, allCoreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import { NewsletterForm } from 'pliny/ui/NewsletterForm'
import { allBlogs } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'

// import PerlinNoiseCanvas from '@/components/PerlinNoiseCanvas'
import dynamic from 'next/dynamic'

const PerlinNoiseCanvas = dynamic(
  () => import('@/components/PerlinNoiseCanvas').then((mod) => mod.default),
  {
    ssr: false,
  }
)

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
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <div>
            <div className="mb-16 flex flex-auto flex-wrap justify-center gap-4">
              <div className="max-w-sm">
                <h1 className="mb-2 text-left text-3xl font-extrabold leading-9 tracking-tight text-blue-500 dark:text-blue-200 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
                  Welcome
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Hi, Passionate about automating redundant work by designing and creating intuitive
                  tools. Also love to explore AI innovations
                  (https://simonwillison.net/2022/Aug/29/stable-diffusion/), travel, read, study
                  philosophy, do water sports, cook. I'm a developer With a background in Interested
                  in
                </p>
              </div>
              <div className="min-w-sm max-w-sm">
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
          {!posts.length && 'No posts found.'}
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
        <div className="flex scale-75 items-center justify-center pt-10">
          <NewsletterForm
            title="Get informed about latest projects"
            // apiUrl="http://eepurl.com/icv8br"
          />
        </div>
      )}
    </>
  )
}
