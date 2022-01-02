import Head from 'next/head';
import styles from './Home.module.css';
import Link from 'next/link';

const Home = () => (
  <>
    <Head>
      <title>Home - NextJS Frontend Framework</title>
    </Head>

    <main className={styles.main}>
      <h1 className={styles.title}>NextJS Framework Template</h1>

      <h2>Sample pages</h2>
      <ul>
        <li>
          <Link href="/users">
            <a>Users (CRUD example)</a>
          </Link>
        </li>
      </ul>

      <div className={styles.grid}>
        <div className={styles.card}>
          If you would like to support these tutorials I have a Patreon account
          where you could contribute. It is a service that allows supporters to
          contribute as little as a dollar a month. I would be most grateful for
          any support. Also, if you have suggestions for future topics I would
          love to hear your feedback.
          <br />
          <br />
          <div>
            Patreon:{' '}
            <Link href="https://www.patreon.com/czetsuya">
              <a>https://www.patreon.com/czetsuya</a>
            </Link>
          </div>
        </div>
      </div>
    </main>

    <footer className={styles.footer}>
      <a
        href="https://www.czetsuyatech.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Czetsuya Tech
      </a>
    </footer>
  </>
);

export default Home;
