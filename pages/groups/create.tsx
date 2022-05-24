import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType } from "../../types";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Button from "../../components/Button";
import { GroupAtomType } from "../../types/groups";
import { isLoadingAPI } from "../../state/app";

const GroupCreate: NextPage = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoading, setIsLoading] = useAtom(isLoadingAPI);
  const [name, setName] = useState("");

  const createButtonDisabled = name === "" || isLoading;

  const createGroupHandler = async () => {
    setIsLoading(true);

    const groupData = {
      name: name || null,
    };

    const rawResponse = await fetch(`${ENDPOINTS.groups}/createGroup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData),
    });
    const res: APIResponseType<GroupAtomType> = await rawResponse.json();

    if (res.success) {
      const groupData = res.data;
      toast.success(
        `${t.groups.successGroupCreated} (${JSON.stringify(groupData)})`
      ); // TODO: cleanup toast
      router.push(ROUTES.groups);
    } else {
      toast.error(`${t.groups.errorCreateGroup} (${res.error_type})`);
      console.error("error_type: ", res.error_type);
    }

    setIsLoading(false);
    return;
  };

  return (
    <LayoutAuth>
      <h2>{t.groups.createGroupTitle}</h2>

      <div className={styles.formBlock}>
        <label className={styles.label} htmlFor="group-name">
          {t.groups.groupLabelName} *
        </label>
        <input
          id="group-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder={t.groups.groupLabelName}
          required
          disabled={isLoading}
        />
      </div>

      <Button onClick={createGroupHandler} disabled={createButtonDisabled}>
        {t.groups.createGroupButton}
      </Button>
    </LayoutAuth>
  );
};

export default GroupCreate;
