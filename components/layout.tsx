import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useLocale from "../state/useLocale";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLocale();

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {t.common.choares} — {t.common.description}
        </title>
        <meta name="description" content={t.common.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>
          <Link href="/">{t.common.choares}</Link>
        </h1>
        <div>
          <Link href="/tasks/new-task">{t.tasks.createTaskMenu}</Link>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <Link href="/about">{t.about.title}</Link>
          <Link href="/settings">{t.settings.title}</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
