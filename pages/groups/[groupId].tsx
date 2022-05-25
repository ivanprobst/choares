import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAtom } from "jotai";

import styles from "../../styles/Home.module.css";
import LayoutAuth from "../../components/LayoutAuth";
import useLocale from "../../hooks/useLocale";
import { ENDPOINTS, LOCAL_STORAGE } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import BannerPageError from "../../components/BannerPageError";
import Button from "../../components/Button";
import { groupAtom, groupSessionAtom, groupsMapAtom } from "../../state/groups";
import { isLoadingAPIAtom } from "../../state/app";
import { GroupAtomType } from "../../types/groups";
import { useAPI } from "../../hooks/useAPI";

const GroupDetails = () => {
  const { t } = useLocale();

  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading] = useAtom(isLoadingAPIAtom);
  const [group, setGroup] = useAtom(groupAtom);
  const [groupSession, setGroupSession] = useAtom(groupSessionAtom);

  if (!group) {
    return null;
  }

  const { runFetch } = useAPI<GroupAtomType>({ mode: "manual" });

  const isCurrentGroup = groupSession?.id === group.id;

  const setAsCurrentGroup = async () => {
    setGroupSession(group);
    localStorage.setItem(LOCAL_STORAGE.groupId, group.id);
    toast.success(`${t.groups.successGroupSwitch} ${group.name}`);
  };

  const addMemberHandler = async () => {
    const updatedData = { userEmail };

    const processSuccess = (data: GroupAtomType) => {
      toast.success(t.groups.successAddMember);
      setGroup(data);
    };

    await runFetch({
      method: "PUT",
      endpoint: `${ENDPOINTS.groups}/addMemberToGroup?groupId=${group.id}`,
      body: updatedData,
      processSuccess,
    });
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

  const [isLoadingAPI, setIsLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [groupsMap] = useAtom(groupsMapAtom);
  const [group, setGroup] = useAtom(groupAtom);

  const processSuccess = (data: GroupAtomType) => {
    setGroup(data);
    return;
  };
  const { runFetch } = useAPI<GroupAtomType>({ mode: "manual" });

  useEffect(() => {
    setIsLoadingAPI(true);

    if (!isReady) {
      return; // TODO: Display some kind of error
    }

    const { groupId } = query;
    if (!groupId || Array.isArray(groupId)) {
      setIsLoadingAPI(false);
      return; // TODO: Display some kind of error
    }

    const groupCached = groupsMap?.get(groupId);
    if (!groupCached) {
      runFetch({
        endpoint: `${ENDPOINTS.groups}/getGroupById?groupId=${groupId}`,
        method: "GET",
        processSuccess,
      });
    } else {
      setGroup(groupCached);
      setIsLoadingAPI(false);
    }

    return;
  }, [t, query]);

  return (
    <LayoutAuth>
      {isLoadingAPI ? (
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
