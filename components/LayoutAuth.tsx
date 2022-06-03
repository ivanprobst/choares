import { useEffect, ReactNode, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";

import styles from "../styles/Layout.module.scss";
import useLocale from "../hooks/useLocale";
import { ENDPOINTS, LOCAL_STORAGE, ROUTES } from "../utils/constants";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import { APIResponseType } from "../types";
import { userSessionAtom } from "../state/users";
import { groupSessionAtom } from "../state/groups";
import { GroupAtomType } from "../types/groups";
import { IconAdd } from "../icons/IconAdd";
import { IconSettings } from "../icons/IconSettings";
import Button from "./Button";
import { isLoadingAPIAtom } from "../state/app";

const GroupErrorOverlay = () => {
  const { t } = useLocale();
  const router = useRouter();
  return (
    <div className={styles.genericContainer}>
      <h2>{t.groups.notInGroup}</h2>
      <p>{t.groups.infoMustCreateGroup}</p>
      <Button onClick={() => router.push(ROUTES.groupsCreate)} type="blue">
        {t.groups.createGroupButton}
      </Button>
    </div>
  );
};

const LayoutAuth = ({ children }: { children: ReactNode }) => {
  const { t } = useLocale();
  const [isLoadingAPI, setIsLoadingAPI] = useAtom(isLoadingAPIAtom);

  const router = useRouter();
  const [groupSession, setGroupSession] = useAtom(groupSessionAtom);
  const [, setUserSession] = useAtom(userSessionAtom);

  const displayGroupError =
    !groupSession && router.pathname !== ROUTES.groupsCreate;

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(ROUTES.home);
      return;
    },
  });

  useEffect(() => {
    if (session?.user) {
      setUserSession({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      });
    }
  }, [session?.user, setUserSession]);

  const getCurrentGroup = useCallback(async () => {
    const currentGroupId = localStorage.getItem(LOCAL_STORAGE.groupId);

    if (currentGroupId) {
      setIsLoadingAPI(true);
      const response = await fetch(
        `${ENDPOINTS.groups}/getGroupById?groupId=${currentGroupId}`,
        {
          method: "GET",
        }
      );
      const responseJSON: APIResponseType<GroupAtomType> =
        await response.json();
      setIsLoadingAPI(false);

      if (!responseJSON.success) {
        return { success: false, error_type: responseJSON.error_type };
      }

      return { success: true, group: responseJSON.data };
    } else {
      setIsLoadingAPI(true);
      const response = await fetch(
        `${ENDPOINTS.groups}/getAllGroupsBySessionUserId`,
        {
          method: "GET",
        }
      );
      const responseJSON: APIResponseType<Array<GroupAtomType>> =
        await response.json();
      setIsLoadingAPI(false);

      if (!responseJSON.success) {
        return { success: false, error_type: responseJSON.error_type };
      }

      if (responseJSON.data.length === 0) {
        return { success: false, error_type: "no_group_found" };
      }

      return { success: true, group: responseJSON.data[0] };
    }
  }, [setIsLoadingAPI]);

  useEffect(() => {
    const initCurrentGroupdId = async () => {
      const { success, group } = await getCurrentGroup();

      if (!success || !group) {
        return;
      }

      localStorage.setItem(LOCAL_STORAGE.groupId, group.id);
      setGroupSession({
        id: group.id,
        name: group.name,
        members: group.members,
      });
    };

    if (status !== "loading" && session && !groupSession) {
      initCurrentGroupdId();
    }
  }, [status, session, setGroupSession, getCurrentGroup, t, groupSession]);

  if (status === "loading" || isLoadingAPI) {
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

      <main className={styles.main}>
        {displayGroupError ? <GroupErrorOverlay /> : children}
      </main>

      <footer className={styles.footer}>
        <p className={styles.groupContainer}>
          {`${t.groups.group}: ${
            groupSession?.name ? groupSession.name : t.groups.notInGroup
          }`}
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
