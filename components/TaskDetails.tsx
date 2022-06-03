import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAtom } from "jotai";

import styles from "../styles/Tasks.module.scss";
import useLocale from "../hooks/useLocale";
import { ENDPOINTS, ROUTES } from "../utils/constants";
import { addDays } from "date-fns";
import Button from "../components/Button";
import { userSessionAtom } from "../state/users";
import { taskAtom } from "../state/tasks";
import { isLoadingAPIAtom } from "../state/app";
import { TaskAtomType } from "../types/tasks";
import { useAPI } from "../hooks/useAPI";
import { toHumanDate } from "../utils/dates";
import { IconClock } from "../icons/IconClock";

export const TaskActions = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [userSession] = useAtom(userSessionAtom);
  const [task, setTask] = useAtom(taskAtom);

  const { runFetch } = useAPI<TaskAtomType>({ mode: "manual" });

  if (!task) {
    return null;
  }

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
  );
};

export const TaskDetails = () => {
  const { t } = useLocale();

  const [task] = useAtom(taskAtom);

  if (!task) {
    return null;
  }

  return (
    <>
      <section className={styles.taskDetails}>
        <h2>{task.name}</h2>
        <p className={styles.dueDate}>
          <IconClock />
          {`${t.tasks.dueBy}: ${
            task.dueDate ? toHumanDate(task.dueDate) : "-"
          }`}
        </p>
        {task.description && <p>{task.description}</p>}
      </section>
    </>
  );
};
