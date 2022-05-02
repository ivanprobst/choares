import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { format, isToday } from "date-fns";

import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";
import useLocale from "../state/useLocale";
import { APIResponseType, TaskDBType } from "../types";
import Spinner from "../components/Spinner";
import { API_ROUTE_TASKS } from "../utils/constants";
import useTabs from "../hooks/useTabs";
import { TabsContainer } from "../components/Tab";
import BannerPageError from "../components/BannerPageError";

const TaskItem = ({ task }: { task: TaskDBType }) => {
  const { t } = useLocale();
  const router = useRouter();

  const openTaskHandler = () => {
    console.log("open task");
    router.push(`/task/${task.id}`);
  };

  return (
    <li
      className={styles.tasksListItem}
      key={task.id}
      onClick={openTaskHandler}
    >
      <div>
        <h3 className={styles.tasksListName}>{task.name}</h3>
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

const TaskList = ({ tasks }: { tasks?: Array<TaskDBType> }) => {
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

const TasksListPage: NextPage = () => {
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Array<TaskDBType> | undefined>(undefined);

  const todayTasks = tasks?.filter(
    (task) => task.dueDate && isToday(new Date(task.dueDate)) && !task.completed
  );
  const allUncompletedTasks = tasks?.filter((task) => !task.completed);
  const allCompletedTasks = tasks?.filter((task) => task.completed);
  const Tabs = [
    { title: "Today's task", content: <TaskList tasks={todayTasks} /> },
    {
      title: "Uncompleted tasks",
      content: <TaskList tasks={allUncompletedTasks} />,
    },
    {
      title: "Completed tasks",
      content: <TaskList tasks={allCompletedTasks} />,
    },
  ];
  const { CurrentTab, tabs } = useTabs(Tabs);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);

      const response = await fetch(API_ROUTE_TASKS, {
        method: "GET",
      });
      const responseJSON: APIResponseType = await response.json();

      if (responseJSON.success) {
        setTasks(responseJSON.data);
      } else {
        setTasks(undefined);
        toast.error(`${t.tasks.errorLoadTasks} (${responseJSON.error_type})`);
        console.log("error_type: ", responseJSON.error_type);
      }

      setIsLoading(false);
      return;
    };

    fetchTasks();
    return;
  }, [t]);

  return (
    <>
      <Layout>
        <TabsContainer>{tabs.map((tab) => tab)}</TabsContainer>
        {isLoading ? <Spinner /> : <CurrentTab />}
      </Layout>
    </>
  );
};

export default TasksListPage;
