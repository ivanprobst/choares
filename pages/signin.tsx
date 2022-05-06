import React from "react";
import { signIn, useSession } from "next-auth/react";

import styles from "../styles/Home.module.css";
import Button from "../components/Button";
import Head from "next/head";
import useLocale from "../state/useLocale";
import { useRouter } from "next/router";
import { ROUTES } from "../utils/constants";
import { NextPage } from "next";

const Signin: NextPage = () => {
  const { t } = useLocale();
  const { data: session } = useSession();
  const router = useRouter();

  const signInHandler = () => {
    signIn();
  };

  if (session) {
    router.push(ROUTES.tasksList);
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
        <h1 className={styles.title}>{t.common.choares}</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.authGuardianContainer}>
          <h2>{t.common.choaresTitle}</h2>
          <h3>{t.common.choaresSubtitle}</h3>
          <Button onClick={signInHandler} type="blue">
            Sign in to start
          </Button>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>{t.about.copyright}</p>
        <nav className={styles.nav}>
          <p>
            <a
              href="https://ivanprobst.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about.website}
            </a>
            &nbsp;|&nbsp;
            <a
              href="https://github.com/ivanprobst"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about.github}
            </a>
          </p>
        </nav>
      </footer>
    </div>
  );
};

export default Signin;
