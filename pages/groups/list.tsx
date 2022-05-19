import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import toast from "react-hot-toast";
import Link from "next/link";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType, GroupDBType } from "../../types";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import GroupContext from "../../state/GroupContext";

const GroupList = ({ groups }: { groups?: Array<GroupDBType> }) => {
  const { t } = useLocale();

  const { currentGroupId } = useContext(GroupContext);

  return !groups ? (
    <p>{t.groups.errorLoadGroups}</p>
  ) : groups.length === 0 ? (
    <p>{t.groups.notInGroup}</p>
  ) : (
    <ul className={styles.groupList}>
      {groups.map((group) => (
        <li className={styles.groupItem} key={group.id}>
          <h3>
            <Link href={`${ROUTES.group}/${group.id}`}>{group.name}</Link>
            {currentGroupId === group.id ? ` (${t.common.current})` : ""}
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
  );
};

const Groups: NextPage = () => {
  const { t } = useLocale();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groups, setGroups] = useState<Array<GroupDBType> | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);

      const response = await fetch(ENDPOINTS.groups, {
        method: "GET",
      });
      const responseJSON: APIResponseType = await response.json();

      if (responseJSON.success) {
        setGroups(responseJSON.data);
      } else {
        setGroups(undefined);
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
      <h2>{t.groups.title}</h2>
      <a href={ROUTES.groupsCreate}>Create a new group</a>
      {isLoading ? <Spinner /> : <GroupList groups={groups} />}
    </LayoutAuth>
  );
};

export default Groups;