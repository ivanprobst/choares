import { useEffect } from "react";
import type { NextPage } from "next";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType } from "../../types";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import {
  groupsArrayAtom,
  groupSessionAtom,
  groupsMapAtom,
} from "../../state/groups";
import { GroupAPIReturnedType } from "../../types/groups";
import { isLoadingAPI } from "../../state/app";

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

  const [isLoading, setIsLoading] = useAtom(isLoadingAPI);
  const [, setGroupsList] = useAtom(groupsMapAtom);

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);

      const response = await fetch(ENDPOINTS.groups, {
        method: "GET",
      });
      const responseJSON: APIResponseType = await response.json();

      if (responseJSON.success) {
        const groupsListMap = responseJSON.data.map(
          (group: GroupAPIReturnedType) => [group.id, group]
        );
        setGroupsList(new Map(groupsListMap));
      } else {
        setGroupsList(undefined);
        toast.error(`${t.groups.errorLoadGroups} (${responseJSON.error_type})`);
        console.error("error_type: ", responseJSON.error_type);
      }

      setIsLoading(false);
      return;
    };

    fetchGroups();
    return;
  }, [t]);

  return (
    <LayoutAuth>
      <a href={ROUTES.groupsCreate}>Create a new group</a>
      {isLoading ? <Spinner /> : <GroupList />}
    </LayoutAuth>
  );
};

export default Groups;
