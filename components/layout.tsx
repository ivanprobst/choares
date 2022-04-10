import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Choares — Your home chores, shared</title>
        <meta name="description" content="Your home chores, shared" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>
          <Link href="/">Choares</Link>
        </h1>
        <div>
          <Link href="/tasks/new-task">New task</Link>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <Link href="/about">About</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
