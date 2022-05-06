import React from "react";
import Head from "next/head";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import styles from "../styles/Home.module.css";
import useLocale from "../state/useLocale";
import { ROUTES } from "../utils/constants";
import Spinner from "./Spinner";
import { useRouter } from "next/router";

const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLocale();
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(ROUTES.signin);
    },
  });

  if (status === "loading") {
    return <Spinner />;
  }

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
          <Link href={ROUTES.tasksList}>{t.common.choares}</Link>
        </h1>
        <div>
          <Link href={ROUTES.tasksCreate}>{t.tasks.createTaskMenu}</Link>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>{t.about.copyright}</p>
        <nav className={styles.nav}>
          <Link href={ROUTES.groups}>{t.groups.title}</Link>
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

export default LayoutAuth;
