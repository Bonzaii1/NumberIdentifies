import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Draw from '../pages/Component/Draw.jsx';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Number Predictor with <strong>Next.js and TF!</strong>
        </h1>
        <Draw className={styles.draw} />
      </main>
    </div>
  );
}
