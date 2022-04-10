import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../components/layout";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponse } from "../../utils/types";
import { API_ROUTE_TASKS } from "../../utils/constants";

const NewTask: NextPage = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(""); // TODO: move to date format (datefns, etc.)

  const createTaskHandler = async () => {
    const taskData = {
      taskName,
      taskDescription,
      taskDueDate,
    };

    const response = await fetch(API_ROUTE_TASKS, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    const responseJSON: APIResponse = await response.json();

    // TODO: display confirmation / error notification
    if (responseJSON.success) {
      console.log("data: ", responseJSON.data);
      router.push("/");
    } else {
      console.log("error_type: ", responseJSON.error_type);
    }

    return;
  };

  return (
    <Layout>
      <section>
        <h2>{t.tasks.createTaskTitle}</h2>

        <div className={styles.formBlock}>
          <label className={styles.label} htmlFor="task-name">
            {t.tasks.taskLabelName}
          </label>
          <textarea
            id="task-name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
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
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
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
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            type="date"
            className={styles.input}
            placeholder={t.tasks.taskLabelDueDate} // TODO: default to the next day
          />
        </div>

        <button className={styles.button} onClick={createTaskHandler}>
          {t.tasks.createTaskButton}
        </button>
      </section>
    </Layout>
  );
};

export default NewTask;
