import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../components/layout";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType, TaskDBType } from "../../utils/types";
import { API_ROUTE_TASKS } from "../../utils/constants";

const NewTask: NextPage = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // TODO: default to the next day, move to datefns

  const createTaskHandler = async () => {
    const taskData = {
      name: name || null,
      description: description || null,
      dueDate: new Date(dueDate) || null,
    };

    const response = await fetch(API_ROUTE_TASKS, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    const responseJSON: APIResponseType = await response.json();

    // TODO: display confirmation / error notification
    if (responseJSON.success) {
      const taskData = responseJSON.data as TaskDBType;
      console.log("taskData: ", taskData);
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

        <button className={styles.button} onClick={createTaskHandler}>
          {t.tasks.createTaskButton}
        </button>
      </section>
    </Layout>
  );
};

export default NewTask;
