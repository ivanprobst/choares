import { useEffect } from "react";
import type { NextPage } from "next";
import toast from "react-hot-toast";
import Link from "next/link";
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

const GroupList = () => {
  const { t } = useLocale();

  const [groupSession] = useAtom(groupSessionAtom);
  const [groupsList] = useAtom(groupsArrayAtom);

  return !groupsList ? (
    <p>{t.groups.errorLoadGroups}</p>
  ) : groupsList.length === 0 ? (
    <p>{t.groups.notInGroup}</p>
  ) : (
    groupsList && (
      <ul className={styles.groupList}>
        {groupsList.map((group) => (
          <li className={styles.groupItem} key={group.id}>
            <h3>
              <Link href={`${ROUTES.group}/${group.id}`}>{group.name}</Link>
              {groupSession?.id === group.id ? ` (${t.common.current})` : ""}
            </h3>
            <p className={styles.groupMembers}>
              <>
                {`${t.groups.members}: `}
                {group.members?.length > 0
                  ? group.members.map((member) => member.user.name).join(", ")
                  : t.groups.noMembers}
              </>
            </p>
          </li>
        ))}
      </ul>
    )
  );
};

const Groups: NextPage = () => {
  const { t } = useLocale();

  const [isLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [, setGroupsList] = useAtom(groupsMapAtom);
  const [groupSession] = useAtom(groupSessionAtom);

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
  const { runFetch } = useAPI<Array<GroupAtomType>>({ mode: "manual" });

  useEffect(() => {
    if (groupSession) {
      runFetch({
        endpoint: `${ENDPOINTS.groups}/getAllGroupsBySessionUserId`,
        method: "GET",
        processSuccess,
      });
    }

    return;
  }, [t, groupSession]);

  return (
    <LayoutAuth>
      <a href={ROUTES.groupsCreate}>Create a new group</a>
      {isLoadingAPI ? <Spinner /> : <GroupList />}
    </LayoutAuth>
  );
};

export default Groups;
