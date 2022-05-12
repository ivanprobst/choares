import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { format, isToday } from "date-fns";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType, TaskDBType } from "../../types";
import Spinner from "../../components/Spinner";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import useTabs from "../../hooks/useTabs";
import { TabsContainer } from "../../components/Tab";
import BannerPageError from "../../components/BannerPageError";
import GroupContext from "../../state/GroupContext";

const TaskItem = ({ task }: { task: TaskDBType }) => {
  const { t } = useLocale();
  const router = useRouter();

  const openTaskHandler = () => {
    router.push(`${ROUTES.task}/${task.id}`);
  };

  return (
    <li
      className={styles.tasksListItem}
      key={task.id}
      onClick={openTaskHandler}
    >
      <div>
        <h3 className={styles.tasksListName}>{task.name}</h3>
        <p>
          {task.assigneeId
            ? `Assigned to ${task.assigneeId.slice(-4)}`
            : "No one assigned"}
        </p>
        <p className={styles.tasksListDueDate}>
          {`${t.tasks.dueBy}: ${
            task.dueDate ? format(new Date(task.dueDate), "MMM d, y") : "-"
          }`}
        </p>
      </div>
      <div className={styles.tasksListConfirmation}>
        {/* <Button type="blue" onClick={taskCompletionHandler}>
          {t.tasks.taskCompleted}
        </Button> */}
      </div>
    </li>
  );
};

const TasksList = ({ tasks }: { tasks: Array<TaskDBType> | undefined }) => {
  return tasks ? (
    <ul className={styles.tasksList}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task}></TaskItem>
      ))}
    </ul>
  ) : (
    <BannerPageError />
  );
};

const TasksListPanel = () => {
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Array<TaskDBType> | undefined>(undefined);

  const { currentGroupId } = useContext(GroupContext);

  const todayTasks = tasks?.filter(
    (task) => task.dueDate && isToday(new Date(task.dueDate)) && !task.completed
  );
  const allUncompletedTasks = tasks?.filter((task) => !task.completed);
  const allCompletedTasks = tasks?.filter((task) => task.completed);
  const Tabs = [
    { title: "Today's task", content: <TasksList tasks={todayTasks} /> },
    {
      title: "Uncompleted tasks",
      content: <TasksList tasks={allUncompletedTasks} />,
    },
    {
      title: "Completed tasks",
      content: <TasksList tasks={allCompletedTasks} />,
    },
  ];
  const { CurrentTab, tabs } = useTabs(Tabs);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);

      const response = await fetch(
        `${ENDPOINTS.tasks}?groupId=${currentGroupId}`,
        {
          method: "GET",
        }
      );
      const responseJSON: APIResponseType = await response.json();

      if (responseJSON.success) {
        setTasks(responseJSON.data);
      } else {
        setTasks(undefined);
        toast.error(`${t.tasks.errorLoadTasks} (${responseJSON.error_type})`);
        console.error("error_type: ", responseJSON.error_type);
      }

      setIsLoading(false);
      return;
    };

    if (currentGroupId) {
      fetchTasks();
    }
    return;
  }, [t, currentGroupId]);

  return (
    <>
      <TabsContainer>{tabs.map((tab) => tab)}</TabsContainer>
      {isLoading ? <Spinner /> : <CurrentTab />}
    </>
  );
};

const TasksListPage: NextPage = () => {
  const { t } = useLocale();

  return (
    <>
      <LayoutAuth>
        <h2>{t.tasks.tasksList}</h2>
        <TasksListPanel />
      </LayoutAuth>
    </>
  );
};

export default TasksListPage;
