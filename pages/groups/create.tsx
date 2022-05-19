import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType, GroupDBType } from "../../types";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Button from "../../components/Button";

const GroupCreate: NextPage = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");

  const submitDisabled = name === "";

  const createGroupHandler = async () => {
    const groupData = {
      name: name || null,
    };

    const response = await fetch(ENDPOINTS.groups, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData),
    });
    const responseJSON: APIResponseType = await response.json();

    if (responseJSON.success) {
      const groupData = responseJSON.data as GroupDBType;
      toast.success(
        `${t.groups.successGroupCreated} (${JSON.stringify(groupData)})`
      ); // TODO: cleanup toast
      router.push(ROUTES.groups);
    } else {
      toast.error(`${t.groups.errorCreateGroup} (${responseJSON.error_type})`);
      console.error("error_type: ", responseJSON.error_type);
    }

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
        />
      </div>

      <Button onClick={createGroupHandler} disabled={submitDisabled}>
        {t.groups.createGroupButton}
      </Button>
    </LayoutAuth>
  );
};

export default GroupCreate;