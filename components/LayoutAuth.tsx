import { useEffect, useState, ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import styles from "../styles/Home.module.css";
import useLocale from "../state/useLocale";
import { ENDPOINTS, LOCAL_STORAGE, ROUTES } from "../utils/constants";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import GroupContext from "../state/GroupContext";
import { APIResponseType } from "../types";
import toast from "react-hot-toast";

const LayoutAuth = ({ children }: { children: ReactNode }) => {
  const { t } = useLocale();
  const router = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(ROUTES.signin);
    },
  });

  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  // TODO: save to state
  useEffect(() => {
    const initCurrentGroupdId = async () => {
      const currentGroupId = localStorage.getItem(LOCAL_STORAGE.groupId);
      if (!currentGroupId) {
        const response = await fetch(ENDPOINTS.groups, {
          method: "GET",
        });
        const responseJSON: APIResponseType = await response.json();

        if (!responseJSON.success) {
          toast.error(
            `${t.groups.errorLoadGroups} (${responseJSON.error_type})`
          );
          console.log("error_type: ", responseJSON.error_type);
          return;
        }

        if (responseJSON.data[0]) {
          localStorage.setItem(LOCAL_STORAGE.groupId, responseJSON.data[0].id);
        } else {
          // TODO: entire system fails in this case, bring to error page
          toast.error(`${t.groups.errorNoGroup}`);
        }
      }
      setCurrentGroupId(localStorage.getItem(LOCAL_STORAGE.groupId));
    };

    initCurrentGroupdId();
  }, [t]);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <GroupContext.Provider value={{ currentGroupId, setCurrentGroupId }}>
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
            <div>
              <Link href={ROUTES.groups}>{t.groups.title}</Link>
              {` (${t.common.current}: ${currentGroupId?.slice(0, 4)})`}
            </div>
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
    </GroupContext.Provider>
  );
};

export default LayoutAuth;
