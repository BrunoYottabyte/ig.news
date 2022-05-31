import { GetServerSideProps, GetStaticProps } from 'next'
import Head from '../../node_modules/next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import { priceFormat } from '../utils/priceFormat';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      {/*  */}

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about
            <br /> the <span>React</span> world
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {priceFormat(product.amount)} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>

    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async () => {
  export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1L5KjGEEIgWhIESkfrt5sluz", {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: (price.unit_amount / 100),
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}