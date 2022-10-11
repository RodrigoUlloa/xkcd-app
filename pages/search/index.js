import Head from 'next/head'
import { Layout } from 'components/Layout.js'
import Image from 'next/image'
import { search } from 'services/search.js'
import { useI18N } from "context/i18n.js";
import Link from 'next/link';

export default function Component({query, results}) { 
  const {t} = useI18N()
  return <>
    <Head>
      <title>xkcd - Results for {query}</title>
      <meta name="description" content={`Search results for ${query}`} />
    </Head>

    <Layout>
      <h1>{t('SEARCH_RESULTS_TITLE', results.length, query)}</h1>
      {
        results.map(result => {
          return (
            <Link href={`/comic/${result.id}`} key={result.id}>
              <a className='flex flex-row content-center justify-start bg-state-300 hover:bg-slate-50'>
                <Image width='50' height='50' src={result.img} alt={result.alt} className='rounded-full' />
                <div>
                  <h2>{result.title}</h2>
                </div>
              </a>
            </Link>
          )
        })
      }
    </Layout>

    
    <style jsx>{``}</style>
  </> 
}

export async function getServerSideProps (context) {
  const {query} = context
  const { q = '' } = query

  const { results } = await search({ query: q })

  //Llamar api angola 
  return {
    props: {
      query: q,
      results
    }
  }
}