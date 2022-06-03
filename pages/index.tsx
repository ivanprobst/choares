import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Layout.module.scss";
import { signIn } from "next-auth/react";

import useLocale from "../hooks/useLocale";
import { ROUTES } from "../utils/constants";
import Button from "../components/Button";
import { useSession } from "next-auth/react";
import { LayoutDefault } from "../components/LayoutDefault";
import Spinner from "../components/Spinner";

const HomePage: NextPage = () => {
  const { t } = useLocale();
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <LayoutDefault>
      <section className={styles.signinContainer}>
        <h2>{t.common.choaresTitle}</h2>
        <p>{t.common.choaresSubtitle}</p>
        {status === "loading" ? (
          <Spinner />
        ) : session ? (
          <Button onClick={() => router.push(ROUTES.tasksList)} type="blue">
            {t.tasks.goToTasksList}
          </Button>
        ) : (
          <Button onClick={() => signIn()} type="blue">
            {t.signin.signinButton}
          </Button>
        )}
      </section>
    </LayoutDefault>
  );
};

export default HomePage;
