import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";

import styles from "../styles/Layout.module.scss";
import useLocale from "../hooks/useLocale";
import { ENDPOINTS, LOCAL_STORAGE, ROUTES } from "../utils/constants";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import { APIResponseType } from "../types";
import toast from "react-hot-toast";
import { userSessionAtom } from "../state/users";
import { groupSessionAtom } from "../state/groups";
import { GroupAtomType } from "../types/groups";
import { IconAdd } from "../icons/IconAdd";
import { IconSettings } from "../icons/IconSettings";

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
      router.push(ROUTES.home);
      return;
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
  }, [session?.user, setUserSession]);

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

    if (status !== "loading" && session) {
      initCurrentGroupdId();
    }
  }, [t, setGroupSession, status, session]);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <Link href={ROUTES.tasksList}>{t.common.choares}</Link>
        </h1>

        <div className={styles.actionContainer}>
          <Link href={ROUTES.tasksCreate}>
            <a>
              <IconAdd />
            </a>
          </Link>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p className={styles.groupContainer}>
          {`${t.groups.group}: ${groupSession?.name}`}
        </p>

        <nav>
          <Link href={ROUTES.settings}>
            <a>
              <IconSettings />
            </a>
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default LayoutAuth;
