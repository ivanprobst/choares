import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import styles from "../../styles/Home.module.css";
import Layout from "../../components/Layout";
import useLocale from "../../state/useLocale";
import { APIResponseType, TaskDBType } from "../../utils/types";
import { API_ROUTE_TASKS } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import { Tab, TabsContainer } from "../../components/Tab";
import { format } from "date-fns";
import BannerPageError from "../../components/BannerPageError";
import Button from "../../components/Button";

const TaskDetails = ({ task }: { task: TaskDBType }) => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteTaskHandler = async () => {
    setIsLoading(true);

    const response = await fetch(`${API_ROUTE_TASKS}/${task.id}`, {
      method: "DELETE",
    });
    const responseJSON: APIResponseType = await response.json();

    if (responseJSON.success) {
      toast.success(t.tasks.successDeleteTask);
    } else {
      toast.error(`${t.tasks.errorDeleteTask} (${responseJSON.error_type})`);
      console.log("error_type: ", responseJSON.error_type);
    }

    setIsLoading(false);
    router.push("/");
  };

  return (
    <>
      <section className={styles.taskDetails}>
        <h2>{task.name}</h2>
        {task.description && <p>{task.description}</p>}
        <p>
          {`${t.tasks.dueBy}: ${
            task.dueDate ? format(new Date(task.dueDate), "MMM d, y") : "-"
          }`}
        </p>
      </section>

      <section className={styles.taskActions}>
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

      const response = await fetch(`${API_ROUTE_TASKS}/${taskId}`, {
        method: "GET",
      });
      const responseJSON: APIResponseType = await response.json();

      if (responseJSON.success) {
        setTask(responseJSON.data);
      } else {
        setTask(undefined);
        toast.error(`${t.tasks.errorLoadTasks} (${responseJSON.error_type})`);
        console.log("error_type: ", responseJSON.error_type);
      }

      setIsLoading(false);
      return;
    };

    fetchTask();
    return;
  }, [t, taskId]);

  const moveToListHandler = () => {
    router.push("/");
  };

  return (
    <Layout>
      <TabsContainer>
        <Tab onClick={moveToListHandler}>{t.tasks.backTasksList}</Tab>
      </TabsContainer>
      {isLoading ? (
        <Spinner />
      ) : task ? (
        <TaskDetails task={task} />
      ) : (
        <BannerPageError />
      )}
    </Layout>
  );
};

export default Task;