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

const TaskDetails = ({ task }: { task: TaskDBType }) => {
  const { t } = useLocale();
  const router = useRouter();

  const [userSession] = useAtom(userSessionAtom);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<TaskDBType>(task);

  const completeTaskHandler = async () => {
    setIsLoading(true);

    const updatedStatus = {
      completed: !currentTask.completed,
      completedAt: currentTask.completed ? null : new Date(),
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
      setCurrentTask(responseJSON.data);
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
      setCurrentTask(responseJSON.data); // TODO: fix refresh, as assignee is not included
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

    const response = await fetch(`${ENDPOINTS.tasks}/${currentTask.id}`, {
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
      setCurrentTask(responseJSON.data);
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

    const response = await fetch(`${ENDPOINTS.tasks}/${currentTask.id}`, {
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
        <h2>{currentTask.name}</h2>
        {currentTask.description && <p>{currentTask.description}</p>}
        <p>
          {task.assigneeId
            ? `Assigned to ${task.assigneeId.slice(-4)}`
            : "No one assigned"}
        </p>
        <p>
          {`${t.tasks.dueBy}: ${
            currentTask.dueDate
              ? format(new Date(currentTask.dueDate), "MMM d, y")
              : "-"
          }`}
        </p>
      </section>

      <section className={styles.taskActions}>
        <Button onClick={completeTaskHandler} isLoading={isLoading}>
          {currentTask.completed
            ? t.tasks.uncompleteTask
            : t.tasks.completeTask}
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

const Task: NextPage = () => {
  const { t } = useLocale();
  const router = useRouter();

  const { taskId } = router.query;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [task, setTask] = useState<TaskDBType | undefined>(undefined);

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);

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

    if (taskId) {
      fetchTask();
    }
    return;
  }, [t, taskId]);

  const moveToListHandler = () => {
    router.push(ROUTES.tasksList);
  };

  return (
    <LayoutAuth>
      {isLoading ? (
        <Spinner />
      ) : task ? (
        <TaskDetails task={task} />
      ) : (
        <BannerPageError />
      )}
    </LayoutAuth>
  );
};

export default Task;
