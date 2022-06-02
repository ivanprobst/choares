import { useState } from "react";
import toast from "react-hot-toast";
import { useAtom } from "jotai";

import styles from "../styles/Groups.module.scss";
import stylesForm from "../styles/Form.module.scss"; // TODO: remove by defining form styles in comps
import useLocale from "../hooks/useLocale";
import { ENDPOINTS, LOCAL_STORAGE } from "../utils/constants";
import Button from "../components/Button";
import { groupAtom, groupSessionAtom } from "../state/groups";
import { isLoadingAPIAtom } from "../state/app";
import { GroupAtomType } from "../types/groups";
import { useAPI } from "../hooks/useAPI";

export const GroupDetails = () => {
  const { t } = useLocale();

  const [group] = useAtom(groupAtom);

  if (!group) {
    return null;
  }

  return (
    <section className={styles.groupDetails}>
      <h2>{group.name}</h2>
      <p>
        {`${t.groups.members}: `}
        {group.members?.length > 0
          ? group.members.map((member) => member.user.name).join(", ")
          : t.groups.noMembers}
      </p>
    </section>
  );
};

export const GroupActions = () => {
  const { t } = useLocale();

  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading] = useAtom(isLoadingAPIAtom);
  const [group, setGroup] = useAtom(groupAtom);
  const [groupSession, setGroupSession] = useAtom(groupSessionAtom);

  const { runFetch } = useAPI<GroupAtomType>({ mode: "manual" });

  if (!group) {
    return null;
  }

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
    <section className={styles.groupActions}>
      <Button
        onClick={setAsCurrentGroup}
        isLoading={isLoading}
        type="blue"
        disabled={isCurrentGroup}
      >
        {isCurrentGroup
          ? t.groups.alreadyCurrentGroup
          : t.groups.switchGroupButton}
      </Button>

      <div className={stylesForm.formInputBlock}>
        <label htmlFor="group-new-member">{t.groups.newMemberLabel}</label>
        <input
          id="group-new-member"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          type="email"
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
  );
};
