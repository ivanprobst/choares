import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAtom } from "jotai";

import styles from "../../styles/Home.module.css";
import LayoutAuth from "../../components/LayoutAuth";
import useLocale from "../../hooks/useLocale";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import { addDays, format } from "date-fns";
import BannerPageError from "../../components/BannerPageError";
import Button from "../../components/Button";
import { userSessionAtom } from "../../state/users";
import { taskAtom, tasksMapAtom } from "../../state/tasks";
import { isLoadingAPIAtom } from "../../state/app";
import { TaskAtomType } from "../../types/tasks";
import { useAPI } from "../../hooks/useAPI";

const TaskDetails = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [userSession] = useAtom(userSessionAtom);
  const [task, setTask] = useAtom(taskAtom);

  if (!task) {
    return null;
  }

  const { runFetch } = useAPI<TaskAtomType>({ mode: "manual" });

  const completeTaskHandler = async () => {
    const updatedStatus = {
      completed: !task.completed,
      completedAt: task.completed ? null : new Date(),
    };

    const processSuccess = (data: TaskAtomType) => {
      data.completed
        ? toast.success(t.tasks.successCompleteTask)
        : toast.success(t.tasks.successUncompleteTask);

      setTask(data);
    };

    await runFetch({
      method: "PUT",
      endpoint: `${ENDPOINTS.tasks}/updateTask?taskId=${task.id}`,
      body: updatedStatus,
      processSuccess,
    });
  };

  const assignTaskHandler = async () => {
    const updatedAssignee = { assignee: { connect: { id: userSession.id } } };

    const processSuccess = (data: TaskAtomType) => {
      toast.success(t.tasks.successAssignTask);
      setTask(data);
    };

    await runFetch({
      method: "PUT",
      endpoint: `${ENDPOINTS.tasks}/updateTask?taskId=${task.id}`,
      body: updatedAssignee,
      processSuccess,
    });
  };

  const rescheduleTaskHandler = async () => {
    const updatedDueDate = {
      dueDate: addDays(new Date(), 1),
    };

    const processSuccess = (data: TaskAtomType) => {
      toast.success(t.tasks.successRescheduleTask);
      setTask(data);
    };

    await runFetch({
      method: "PUT",
      endpoint: `${ENDPOINTS.tasks}/updateTask?taskId=${task.id}`,
      body: updatedDueDate,
      processSuccess,
    });
  };

  const deleteTaskHandler = async () => {
    const processSuccess = () => {
      toast.success(t.tasks.successDeleteTask);
      router.push(ROUTES.tasksList);
    };

    await runFetch({
      method: "DELETE",
      endpoint: `${ENDPOINTS.tasks}/deleteTaskById?taskId=${task.id}`,
      processSuccess,
    });
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
        <Button onClick={completeTaskHandler} isLoading={isLoadingAPI}>
          {task.completed ? t.tasks.uncompleteTask : t.tasks.completeTask}
        </Button>

        <Button
          onClick={assignTaskHandler}
          type="blue"
          isLoading={isLoadingAPI}
          disabled={task.assigneeId === userSession.id}
        >
          {t.tasks.assignToMe}
        </Button>

        <Button
          onClick={rescheduleTaskHandler}
          type="blue"
          isLoading={isLoadingAPI}
        >
          {t.tasks.rescheduleTaskTomorrow}
        </Button>

        <Button onClick={deleteTaskHandler} type="red" isLoading={isLoadingAPI}>
          {t.tasks.deleteTask}
        </Button>
      </section>
    </>
  );
};

const TaskPage: NextPage = () => {
  const { t } = useLocale();
  const { query, isReady } = useRouter();

  const [isLoading, setIsLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [tasksMap] = useAtom(tasksMapAtom);
  const [task, setTask] = useAtom(taskAtom);

  const processSuccess = (data: TaskAtomType) => {
    setTask(data);
    return;
  };
  const { runFetch } = useAPI<TaskAtomType>({ mode: "manual" });

  useEffect(() => {
    setIsLoadingAPI(true);

    if (!isReady) {
      return; // TODO: Display some kind of error
    }

    const { taskId } = query;
    if (!taskId || Array.isArray(taskId)) {
      setIsLoadingAPI(false);
      return; // TODO: Display some kind of error
    }

    const taskCached = tasksMap?.get(taskId);
    if (!taskCached) {
      runFetch({
        endpoint: `${ENDPOINTS.tasks}/getTaskById?taskId=${taskId}`,
        method: "GET",
        processSuccess,
      });
    } else {
      setTask(taskCached);
      setIsLoadingAPI(false);
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
