import React from "react";
import Head from "next/head";
import Link from "next/link";
import { signOut } from "next-auth/react";

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
          <Link href="/tasks-list">{t.common.choares}</Link>
        </h1>
        <div>
          <Link href="/tasks-create">{t.tasks.createTaskMenu}</Link>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <Link href="/about">{t.about.title}</Link>
          <Link href="/settings">{t.settings.title}</Link>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            {t.common.signout}
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
