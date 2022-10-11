import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { Layout } from 'components/Layout.js'
import { readFile, readdir, stat } from 'fs/promises'
import { basename } from 'path'


export default function Comic({ img, alt, title, width, height, nextId, prevId, hasNext, hasPrevious }) {
  return <>
    <Head>
      <title>xkcd - Comics for developers</title>
      <meta name="description" content="Comics for developers" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout>
      <section className='max-w-lg m-auto'>
          <h1 className='font-bold text-center mb-4'>{title}</h1>
          <div className='max-w-xs m-auto mb-4'>
            <Image 
              layout='responsive' 
              width={width} 
              height={height} 
              src={img} 
              alt={alt} 
            />
          </div>
          <p>{alt}</p>

          <div className='flex justify-between mt-4 front-bold '>
            {
              hasPrevious && <Link href={`/comic/${prevId}`}>
                <a className=''>Previous</a> 
              </Link>
            }
            {
              hasNext && <Link href={`/comic/${nextId}`}>
                <a className=''>Next</a> 
              </Link>
            }
          </div>
        </section>
    </Layout>
  </>
}

export async function getStaticPaths ({ locales }) {
  const files = await readdir('./comics')
  let paths =[]

  locales.forEach(locale => {
   paths = paths.concat(files.map(file => {
      const id = basename(file, '.json')
      return { params: { id }, locale }
    }))
  })

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps({ params }){
  const { id } = params

  const content = await readFile(`./comics/${id}.json`, 'utf8')
  const comic = JSON.parse(content)

  const idNumber = +id
  const prevId = idNumber - 1
  const nextId = idNumber + 1

  const [prevResult, nextResult] = await Promise.allSettled([
    stat(`./comics/${prevId}.json`),
    stat(`./comics/${nextId}.json`),
  ])

  const hasPrevious = prevResult.status === 'fulfilled'
  const hasNext = nextResult.status === 'fulfilled'
  
  /*const promisesReadFiles = latestComicsFiles.map(async (file) => {
    const content = await fs.readFile(`./comics/${file}`, 'utf8')
    return JSON.parse(content)
  })

  const latestComics = await Promise.all(promisesReadFiles)
*/
  return {
    props: {
      ...comic,
      hasPrevious,
      hasNext,
      nextId,
      prevId
    }
  }
}