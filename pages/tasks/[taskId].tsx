import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAtom } from "jotai";

import styles from "../../styles/Home.module.css";
import LayoutAuth from "../../components/LayoutAuth";
import useLocale from "../../state/useLocale";
import { APIResponseType, TaskDBType } from "../../types";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import { addDays, format } from "date-fns";
import BannerPageError from "../../components/BannerPageError";
import Button from "../../components/Button";
import { userSessionAtom } from "../../state/users";
import { taskAtom, tasksMapAtom } from "../../state/tasks";

const TaskDetails = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userSession] = useAtom(userSessionAtom);
  const [task, setTask] = useAtom(taskAtom);

  if (!task) {
    return null;
  }

  const completeTaskHandler = async () => {
    setIsLoading(true);

    const updatedStatus = {
      completed: !task.completed,
      completedAt: task.completed ? null : new Date(),
    };

    const response = await fetch(`${ENDPOINTS.tasks}/${task.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStatus),
    });
    const responseJSON: APIResponseType = await response.json();

    if (responseJSON.success) {
      toast.success(t.tasks.successCompleteTask);
      setTask(responseJSON.data);
    } else {
      toast.error(`${t.tasks.errorCompleteTask} (${responseJSON.error_type})`);
      console.error("error_type: ", responseJSON.error_type);
    }

    setIsLoading(false);
  };

  const assignTaskHandler = async () => {
    setIsLoading(true);

    const updatedStatus = { assignee: { connect: { id: userSession.id } } };

    const response = await fetch(`${ENDPOINTS.tasks}/${task.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStatus),
    });
    const responseJSON: APIResponseType = await response.json();

    if (responseJSON.success) {
      toast.success(t.tasks.successAssignTask);
      setTask(responseJSON.data); // TODO: fix refresh, as assignee is not included
    } else {
      toast.error(`${t.tasks.errorAssignTask} (${responseJSON.error_type})`);
      console.error("error_type: ", responseJSON.error_type);
    }

    setIsLoading(false);
  };

  const rescheduleTaskHandler = async () => {
    setIsLoading(true);

    const updatedDueDate = {
      dueDate: addDays(new Date(), 1),
    };

    const response = await fetch(`${ENDPOINTS.tasks}/${task.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDueDate),
    });
    const responseJSON: APIResponseType = await response.json();

    if (responseJSON.success) {
      toast.success(t.tasks.successRescheduleTask);
      setTask(responseJSON.data);
    } else {
      toast.error(
        `${t.tasks.errorRescheduleTask} (${responseJSON.error_type})`
      );
      console.error("error_type: ", responseJSON.error_type);
    }

    setIsLoading(false);
  };

  const deleteTaskHandler = async () => {
    setIsLoading(true);

    const response = await fetch(`${ENDPOINTS.tasks}/${task.id}`, {
      method: "DELETE",
    });
    const responseJSON: APIResponseType = await response.json();

    if (responseJSON.success) {
      toast.success(t.tasks.successDeleteTask);
    } else {
      toast.error(`${t.tasks.errorDeleteTask} (${responseJSON.error_type})`);
      console.error("error_type: ", responseJSON.error_type);
    }

    setIsLoading(false);
    router.push(ROUTES.tasksList);
  };

  return (
    <>
      <section className={styles.taskDetails}>
        <h2>{task.name}</h2>
        {task.description && <p>{task.description}</p>}
        <p>
          {task.assigneeId
            ? `Assigned to ${task.assigneeId.slice(-4)}`
            : "No one assigned"}
        </p>
        <p>
          {`${t.tasks.dueBy}: ${
            task.dueDate ? format(new Date(task.dueDate), "MMM d, y") : "-"
          }`}
        </p>
      </section>

      <section className={styles.taskActions}>
        <Button onClick={completeTaskHandler} isLoading={isLoading}>
          {task.completed ? t.tasks.uncompleteTask : t.tasks.completeTask}
        </Button>

        <Button
          onClick={assignTaskHandler}
          type="blue"
          isLoading={isLoading}
          disabled={task.assigneeId === userSession.id}
        >
          {t.tasks.assignToMe}
        </Button>

        <Button
          onClick={rescheduleTaskHandler}
          type="blue"
          isLoading={isLoading}
        >
          {t.tasks.rescheduleTaskTomorrow}
        </Button>

        <Button onClick={deleteTaskHandler} type="red" isLoading={isLoading}>
          {t.tasks.deleteTask}
        </Button>
      </section>
    </>
  );
};

const TaskPage: NextPage = () => {
  const { t } = useLocale();
  const { query, isReady } = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasksMap] = useAtom(tasksMapAtom);
  const [task, setTask] = useAtom(taskAtom);

  useEffect(() => {
    setIsLoading(true);

    const fetchTask = async () => {
      const response = await fetch(`${ENDPOINTS.tasks}/${taskId}`, {
        method: "GET",
      });
      const responseJSON: APIResponseType = await response.json();

      if (responseJSON.success) {
        setTask(responseJSON.data);
      } else {
        setTask(undefined);
        toast.error(`${t.tasks.errorLoadTasks} (${responseJSON.error_type})`);
        console.error("error_type: ", responseJSON.error_type);
      }

      setIsLoading(false);
      return;
    };

    if (!isReady) {
      return;
    }

    const { taskId } = query;
    if (!taskId || Array.isArray(taskId)) {
      setIsLoading(false);
      return;
    }
    const taskCached = tasksMap?.get(taskId);
    if (!taskCached) {
      fetchTask();
    } else {
      setTask(taskCached);
      setIsLoading(false);
    }

    return;
  }, [t, query]);

  return (
    <LayoutAuth>
      {isLoading ? <Spinner /> : !task ? <BannerPageError /> : <TaskDetails />}
    </LayoutAuth>
  );
};

export default TaskPage;
