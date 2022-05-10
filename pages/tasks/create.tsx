import { useContext, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { format, addDays } from "date-fns";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType } from "../../types";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Button from "../../components/Button";
import GroupContext from "../../state/groupContext";

const TaskCreationForm = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );

  const { currentGroupId } = useContext(GroupContext);

  const taskCreationDisabled = name === "" || !currentGroupId;

  const createTaskHandler = async () => {
    const taskData = {
      groupId: currentGroupId,
      name: name || null,
      description: description || null,
      dueDate: new Date(dueDate) || null,
    };

    const response = await fetch(ENDPOINTS.tasks, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    const responseJSON: APIResponseType = await response.json();

    if (responseJSON.success) {
      toast.success(t.tasks.successTaskCreated);
      router.push(ROUTES.tasksList);
    } else {
      toast.error(`${t.tasks.errorCreateTask} (${responseJSON.error_type})`);
      console.log("error_type: ", responseJSON.error_type);
    }

    return;
  };

  return (
    <>
      <div className={styles.formBlock}>
        <label className={styles.label} htmlFor="task-name">
          {t.tasks.taskLabelName} *
        </label>
        <textarea
          id="task-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          rows={2}
          placeholder={t.tasks.taskLabelName}
          required
        ></textarea>
      </div>

      <div className={styles.formBlock}>
        <label className={styles.label} htmlFor="task-description">
          {t.tasks.taskLabelDetails}
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
          rows={4}
          placeholder={t.tasks.taskLabelDetails}
        ></textarea>
      </div>

      <div className={styles.formBlock}>
        <label className={styles.label} htmlFor="task-name">
          {t.tasks.taskLabelDueDate}
        </label>
        <input
          id="task-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          type="date"
          className={styles.input}
          placeholder={t.tasks.taskLabelDueDate}
        />
      </div>

      <Button onClick={createTaskHandler} disabled={taskCreationDisabled}>
        {t.tasks.createTaskButton}
      </Button>
    </>
  );
};

const CreateTask: NextPage = () => {
  const { t } = useLocale();

  return (
    <LayoutAuth>
      <h2>{t.tasks.createTaskTitle}</h2>
      <TaskCreationForm />
    </LayoutAuth>
  );
};

export default CreateTask;
