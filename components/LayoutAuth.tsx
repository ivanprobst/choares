import { useEffect, ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useAtom } from "jotai";

import styles from "../styles/Home.module.css";
import useLocale from "../state/useLocale";
import { ENDPOINTS, LOCAL_STORAGE, ROUTES } from "../utils/constants";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import { APIResponseType } from "../types";
import toast from "react-hot-toast";
import { userSessionAtom } from "../state/users";
import { groupSessionAtom } from "../state/groups";
import { GroupAtomType } from "../types/groups";

const getCurrentGroup = async () => {
  const currentGroupId = localStorage.getItem(LOCAL_STORAGE.groupId);

  if (currentGroupId) {
    const response = await fetch(
      `${ENDPOINTS.groups}/getGroupById?groupId=${currentGroupId}`,
      {
        method: "GET",
      }
    );
    const responseJSON: APIResponseType<GroupAtomType> = await response.json();

    if (!responseJSON.success) {
      return { success: false, error_type: responseJSON.error_type };
    }

    return { success: true, group: responseJSON.data };
  } else {
    const response = await fetch(
      `${ENDPOINTS.groups}/getAllGroupsBySessionUserId`,
      {
        method: "GET",
      }
    );
    const responseJSON: APIResponseType<Array<GroupAtomType>> =
      await response.json();

    if (!responseJSON.success) {
      return { success: false, error_type: responseJSON.error_type };
    }

    if (responseJSON.data.length === 0) {
      return { success: false, error_type: "no_group_found" };
    }

    return { success: true, group: responseJSON.data[0] };
  }
};

const LayoutAuth = ({ children }: { children: ReactNode }) => {
  const { t } = useLocale();
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(ROUTES.signin);
    },
  });

  const [, setUserSession] = useAtom(userSessionAtom);
  useEffect(() => {
    if (session?.user) {
      setUserSession({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      });
    }
  }, [session?.user]);

  const [groupSession, setGroupSession] = useAtom(groupSessionAtom);
  useEffect(() => {
    const initCurrentGroupdId = async () => {
      const { success, error_type, group } = await getCurrentGroup();

      if (!success || !group) {
        // TODO: entire system fails in this case, bring to error page
        toast.error(`${t.groups.errorNoGroup} (${error_type})`);
        console.error(`error_type: ${error_type}`);
        return;
      }

      localStorage.setItem(LOCAL_STORAGE.groupId, group.id);
      setGroupSession({
        id: group.id,
        name: group.name,
        members: group.members,
      });
    };

    initCurrentGroupdId();
  }, [t]);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <>
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
          <nav className={styles.nav}>
            <Link href={ROUTES.tasksList}>{t.tasks.tasksList}</Link>
            <Link href={ROUTES.tasksCreate}>{t.tasks.createTaskMenu}</Link>
          </nav>
        </header>

        <main className={styles.main}>{children}</main>

        <footer className={styles.footer}>
          <p>{t.about.copyright}</p>
          <nav className={styles.nav}>
            <div>
              <Link href={ROUTES.groups}>{t.groups.title}</Link>
              {` (${t.common.current}: ${groupSession?.name})`}
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
    </>
  );
};

export default LayoutAuth;
