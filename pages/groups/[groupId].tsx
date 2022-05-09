import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import styles from "../../styles/Home.module.css";
import LayoutAuth from "../../components/LayoutAuth";
import useLocale from "../../state/useLocale";
import { APIResponseType, GroupDBType } from "../../types";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import { Tab, TabsContainer } from "../../components/Tab";
import BannerPageError from "../../components/BannerPageError";
import Button from "../../components/Button";
import GroupContext from "../../state/groupContext";

const GroupDetails = ({ group }: { group: GroupDBType }) => {
  const { t } = useLocale();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentGroup, setCurrentGroup] = useState<GroupDBType>(group);
  const [userEmail, setUserEmail] = useState<string>("");

  const { currentGroupId, setCurrentGroupId } = useContext(GroupContext);
  const isCurrentGroup = currentGroupId === group.id;

  const setAsCurrentGroup = async () => {
    setCurrentGroupId && setCurrentGroupId(currentGroup.id);
    localStorage.setItem("groupId", currentGroup.id);
    toast.success(`${t.groups.successGroupSwitch}${currentGroup.name}`);
  };

  const addMemberHandler = async () => {
    setIsLoading(true);

    const updatedData = { userEmail };

    const response = await fetch(
      `${ENDPOINTS.groups}/${currentGroup.id}/${ENDPOINTS.subMembers}`,
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
      setCurrentGroup(responseJSON.data); // TODO: fix, we lose the members in the returned group data
    } else {
      toast.error(`${t.groups.errorAddMember} (${responseJSON.error_type})`);
      console.log("error_type: ", responseJSON.error_type);
    }

    setIsLoading(false);
  };

  return (
    <>
      <section className={styles.groupDetails}>
        <h2>{currentGroup.name}</h2>
        <p className={styles.groupMembers}>
          <>
            {`${t.groups.members}: `}
            {currentGroup.members?.length > 0
              ? currentGroup.members
                  .map((member) => member.user.name)
                  .join(", ")
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

const Group: NextPage = () => {
  const { t } = useLocale();
  const router = useRouter();

  const { groupId } = router.query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [group, setGroup] = useState<GroupDBType | undefined>(undefined);

  useEffect(() => {
    const fetchGroup = async () => {
      setIsLoading(true);

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

    if (groupId) {
      fetchGroup();
    }
    return;
  }, [t, groupId]);

  const moveToListHandler = () => {
    router.push(ROUTES.groups);
  };

  return (
    <LayoutAuth>
      <TabsContainer>
        <Tab onClick={moveToListHandler} current={true}>
          {t.groups.backGroupList}
        </Tab>
      </TabsContainer>
      {isLoading ? (
        <Spinner />
      ) : group ? (
        <GroupDetails group={group} />
      ) : (
        <BannerPageError />
      )}
    </LayoutAuth>
  );
};

export default Group;
