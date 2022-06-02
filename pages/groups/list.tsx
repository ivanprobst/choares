import { useEffect } from "react";
import type { NextPage } from "next";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Groups.module.scss";
import useLocale from "../../hooks/useLocale";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import {
  groupsArrayAtom,
  groupSessionAtom,
  groupsMapAtom,
} from "../../state/groups";
import { GroupAtomType } from "../../types/groups";
import { isLoadingAPIAtom } from "../../state/app";
import { useAPI } from "../../hooks/useAPI";
import { GroupListItem } from "../../components/GroupListItem";
import Button from "../../components/Button";
import { useRouter } from "next/router";

const GroupList = () => {
  const { t } = useLocale();

  const [groupsList] = useAtom(groupsArrayAtom);

  if (!groupsList) {
    return null;
  }

  return groupsList.length === 0 ? (
    <p>{t.groups.notInGroup}</p>
  ) : (
    groupsList && (
      <ul className={styles.groupList}>
        {groupsList.map((group) => (
          <GroupListItem key={group.id} group={group} />
        ))}
      </ul>
    )
  );
};

const GroupsPage: NextPage = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [, setGroupsList] = useAtom(groupsMapAtom);
  const [groupSession] = useAtom(groupSessionAtom);

  const { runFetch } = useAPI<Array<GroupAtomType>>({ mode: "manual" });

  useEffect(() => {
    const processSuccess = (data: Array<GroupAtomType>) => {
      // We display the current group at the top of the list
      const groupsListMap = data
        .map((group) => [group.id, group] as [string, GroupAtomType])
        .sort(([, groupA], [, groupB]) =>
          groupA.id === groupSession?.id
            ? -1
            : groupB.id === groupSession?.id
            ? 1
            : 0
        );
      setGroupsList(new Map(groupsListMap));
      return;
    };

    if (groupSession) {
      runFetch({
        endpoint: `${ENDPOINTS.groups}/getAllGroupsBySessionUserId`,
        method: "GET",
        processSuccess,
      });
    }

    return;
  }, [t, groupSession, setGroupsList, runFetch]);

  return (
    <LayoutAuth>
      {isLoadingAPI ? (
        <Spinner />
      ) : (
        <>
          <GroupList />
          <Button
            onClick={() => router.push(ROUTES.groupsCreate)}
            type="blue"
            isLoading={isLoadingAPI}
          >
            {t.groups.createGroupButton}
          </Button>
        </>
      )}
    </LayoutAuth>
  );
};

export default GroupsPage;
