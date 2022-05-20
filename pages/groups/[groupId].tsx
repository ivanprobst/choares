import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAtom } from "jotai";

import styles from "../../styles/Home.module.css";
import LayoutAuth from "../../components/LayoutAuth";
import useLocale from "../../state/useLocale";
import { APIResponseType } from "../../types";
import { ENDPOINTS, LOCAL_STORAGE } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import BannerPageError from "../../components/BannerPageError";
import Button from "../../components/Button";
import { groupAtom, groupSessionAtom, groupsMapAtom } from "../../state/groups";
import { isLoadingAPI } from "../../state/app";

const GroupDetails = () => {
  const { t } = useLocale();

  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useAtom(isLoadingAPI);
  const [group, setGroup] = useAtom(groupAtom);
  const [groupSession, setGroupSession] = useAtom(groupSessionAtom);

  if (!group) {
    return null;
  }

  const isCurrentGroup = groupSession?.id === group.id;

  const setAsCurrentGroup = async () => {
    setGroupSession({ id: group.id, name: group.name });
    localStorage.setItem(LOCAL_STORAGE.groupId, group.id);
    toast.success(`${t.groups.successGroupSwitch}${group.name}`);
  };

  const addMemberHandler = async () => {
    setIsLoading(true);

    const updatedData = { userEmail };

    const response = await fetch(
      `${ENDPOINTS.groups}/${group.id}/${ENDPOINTS.subMembers}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );
    const responseJSON: APIResponseType = await response.json();

    if (responseJSON.success) {
      toast.success(t.groups.successAddMember);
      setGroup(responseJSON.data); // TODO: fix, we lose the members in the returned group data
    } else {
      toast.error(`${t.groups.errorAddMember} (${responseJSON.error_type})`);
      console.error("error_type: ", responseJSON.error_type);
    }

    setIsLoading(false);
  };

  return (
    <>
      <section className={styles.groupDetails}>
        <h2>{group.name}</h2>
        <p className={styles.groupMembers}>
          <>
            {`${t.groups.members}: `}
            {group.members?.length > 0
              ? group.members.map((member) => member.user.name).join(", ")
              : t.groups.noMembers}
          </>
        </p>
      </section>

      <section className={styles.taskActions}>
        <Button
          onClick={setAsCurrentGroup}
          isLoading={isLoading}
          type="blue"
          disabled={isCurrentGroup}
        >
          {t.groups.switchGroupButton}
          {isCurrentGroup ? ` (${t.groups.alreadyCurrentGroup})` : ""}
        </Button>

        <div className={styles.formBlock}>
          <label className={styles.label} htmlFor="group-new-member">
            {t.groups.newMemberLabel}
          </label>
          <input
            id="group-new-member"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            type="email"
            className={styles.input}
            placeholder={t.groups.addUserPlaceholder}
          />
        </div>

        <Button
          onClick={addMemberHandler}
          isLoading={isLoading}
          disabled={userEmail === ""} // TODO: check if email format
        >
          {t.groups.newMemberButton}
        </Button>
      </section>
    </>
  );
};

const GroupPage: NextPage = () => {
  const { t } = useLocale();
  const { query, isReady } = useRouter();

  const [isLoading, setIsLoading] = useAtom(isLoadingAPI);
  const [groupsMap] = useAtom(groupsMapAtom);
  const [group, setGroup] = useAtom(groupAtom);

  useEffect(() => {
    setIsLoading(true);

    const fetchGroup = async () => {
      const response = await fetch(`${ENDPOINTS.groups}/${groupId}`, {
        method: "GET",
      });
      const responseJSON: APIResponseType = await response.json();

      if (responseJSON.success) {
        setGroup(responseJSON.data);
      } else {
        setGroup(undefined);
        toast.error(`${t.groups.errorLoadGroups} (${responseJSON.error_type})`);
        console.error("error_type: ", responseJSON.error_type);
      }

      setIsLoading(false);
      return;
    };

    if (!isReady) {
      return;
    }

    const { groupId } = query;
    if (!groupId || Array.isArray(groupId)) {
      setIsLoading(false);
      return;
    }
    const groupCached = groupsMap?.get(groupId);
    if (!groupCached) {
      fetchGroup();
    } else {
      setGroup(groupCached);
      setIsLoading(false);
    }

    return;
  }, [t, query]);

  return (
    <LayoutAuth>
      {isLoading ? (
        <Spinner />
      ) : !group ? (
        <BannerPageError />
      ) : (
        <GroupDetails />
      )}
    </LayoutAuth>
  );
};

export default GroupPage;
