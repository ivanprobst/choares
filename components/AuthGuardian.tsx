import React from "react";
import { signIn, useSession } from "next-auth/react";

import styles from "../styles/Home.module.css";
import Spinner from "./Spinner";
import Button from "./Button";
import Head from "next/head";
import useLocale from "../state/useLocale";

const AuthGuardian = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLocale();
  const { data: session, status } = useSession();

  const signInHandler = () => {
    signIn();
  };

  return !session ? (
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
          {status === "loading" ? (
            <>
              <Spinner />
              {t.common.authorizing}
            </>
          ) : (
            <>
              <h2>{t.common.choaresTitle}</h2>
              <h3>{t.common.choaresSubtitle}</h3>
              <Button onClick={signInHandler} type="blue">
                Sign in to start
              </Button>
            </>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <p>{t.about.copyright}</p>
        </nav>
      </footer>
    </div>
  ) : (
    <>{children}</>
  );
};

export default AuthGuardian;
