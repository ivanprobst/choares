import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { format, addDays } from "date-fns";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../hooks/useLocale";
import { RecurringType } from "../../types/tasks";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Button from "../../components/Button";
import { groupSessionAtom } from "../../state/groups";
import { isLoadingAPIAtom } from "../../state/app";
import { useAPI } from "../../hooks/useAPI";

const TaskCreationForm = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [groupSession] = useAtom(groupSessionAtom);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [assigneeId, setAssigneeId] = useState("");
  const [recurring, setRecurring] = useState<RecurringType | "">("");

  const taskButtonDisabled = name === "" || !groupSession?.id || isLoadingAPI;

  const { runFetch } = useAPI({ mode: "manual" });

  const createTaskHandler = async () => {
    const taskData = {
      groupId: groupSession?.id,
      name: name || null,
      description: description || null,
      dueDate: new Date(dueDate) || null,
      recurring: recurring || null,
      assigneeId: assigneeId || null,
    };

    const processSuccess = () => {
      toast.success(t.tasks.successTaskCreated);
      router.push(ROUTES.tasksList);
      return;
    };
    await runFetch({
      method: "POST",
      endpoint: `${ENDPOINTS.tasks}/createTask`,
      body: taskData,
      processSuccess,
    });

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
          disabled={isLoadingAPI}
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
          disabled={isLoadingAPI}
        ></textarea>
      </div>

      <div className={styles.formBlock}>
        <label className={styles.label} htmlFor="task-date">
          {t.tasks.taskLabelDueDate}
        </label>
        <input
          id="task-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          type="date"
          className={styles.input}
          placeholder={t.tasks.taskLabelDueDate}
          disabled={isLoadingAPI}
        />
      </div>

      {dueDate && (
        <div className={styles.formBlock}>
          <label className={styles.label} htmlFor="task-recurring">
            Repeat the task
          </label>
          <select
            id="task-recurring"
            value={recurring}
            onChange={(e) => setRecurring(e.target.value as RecurringType)}
            className={styles.input}
            disabled={isLoadingAPI}
          >
            <option value="">No</option>
            <option value="weekly">
              Every week on {format(new Date(dueDate), "EEEE")}
            </option>
            <option value="monthly">
              Every month on the {format(new Date(dueDate), "do")}
            </option>
          </select>
        </div>
      )}

      <div className={styles.formBlock}>
        <label className={styles.label} htmlFor="task-assignee">
          {t.tasks.taskLabelAssignee}
        </label>
        <select
          id="task-assignee"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className={styles.input}
          disabled={isLoadingAPI}
        >
          <option value="">{t.tasks.noAssignee}</option>
          {groupSession?.members.map(({ user }) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={createTaskHandler} disabled={taskButtonDisabled}>
        {t.tasks.createTaskButton}
      </Button>
    </>
  );
};

const CreateTaskPage: NextPage = () => {
  const { t } = useLocale();

  return (
    <LayoutAuth>
      <TaskCreationForm />
    </LayoutAuth>
  );
};

export default CreateTaskPage;
