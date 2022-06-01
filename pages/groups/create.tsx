import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Form.module.scss";
import useLocale from "../../hooks/useLocale";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Button from "../../components/Button";
import { GroupAtomType } from "../../types/groups";
import { isLoadingAPIAtom } from "../../state/app";
import { useAPI } from "../../hooks/useAPI";

const GroupCreate: NextPage = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [name, setName] = useState("");

  const { runFetch } = useAPI<GroupAtomType>({ mode: "manual" });

  const createButtonDisabled = name === "" || isLoadingAPI;

  const createGroupHandler = async () => {
    const groupData = {
      name: name || null,
    };

    const processSuccess = () => {
      toast.success(t.groups.successGroupCreated);
      router.push(ROUTES.groups);
      return;
    };

    await runFetch({
      method: "POST",
      endpoint: `${ENDPOINTS.groups}/createGroup`,
      body: groupData,
      processSuccess,
    });

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
          disabled={isLoadingAPI}
        />
      </div>

      <Button onClick={createGroupHandler} disabled={createButtonDisabled}>
        {t.groups.createGroupButton}
      </Button>
    </LayoutAuth>
  );
};

export default GroupCreate;
