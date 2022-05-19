import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { format, addDays } from "date-fns";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType, RecurringType, UserDBType } from "../../types";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Button from "../../components/Button";
import { groupSessionAtom } from "../../state/groups";

const TaskCreationForm = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [assigneeId, setAssigneeId] = useState("");
  const [recurring, setRecurring] = useState<RecurringType | "">("");

  const [groupSession] = useAtom(groupSessionAtom);
  const [groupUsers, setGroupUsers] = useState<Array<UserDBType>>([]);

  const taskCreationDisabled = name === "" || !groupSession?.id;

  // TODO: replace with state
  useEffect(() => {
    const fetchGroup = async () => {
      setIsLoading(true);

      const response = await fetch(`${ENDPOINTS.groups}/${groupSession?.id}`, {
        method: "GET",
      });
      const responseJSON: APIResponseType = await response.json();

      if (responseJSON.success) {
        const groupUsers = responseJSON.data.members.map(
          (member: any) => member.user
        );
        setGroupUsers(groupUsers);
      } else {
        setGroupUsers([]);
        toast.error(`${t.groups.errorLoadGroups} (${responseJSON.error_type})`);
        console.error("error_type: ", responseJSON.error_type);
      }

      setIsLoading(false);
      return;
    };

    if (groupSession?.id) {
      fetchGroup();
    }
    return;
  }, [t, groupSession]);

  const createTaskHandler = async () => {
    const taskData = {
      groupId: groupSession?.id,
      name: name || null,
      description: description || null,
      dueDate: new Date(dueDate) || null,
      recurring: recurring || null,
      assigneeId: assigneeId || null,
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
      console.error("error_type: ", responseJSON.error_type);
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
            disabled={isLoading}
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
          disabled={isLoading}
        >
          <option value="">{t.tasks.noAssignee}</option>
          {groupUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={createTaskHandler} disabled={taskCreationDisabled}>
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
