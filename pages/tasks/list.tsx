import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { format, getTime, isToday } from "date-fns";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import styles from "../../styles/Home.module.css";
import useLocale from "../../state/useLocale";
import { APIResponseType } from "../../types";
import { TaskFilterWhenType, TaskFilterWhoType } from "../../types/tasks";
import Spinner from "../../components/Spinner";
import { ENDPOINTS, ROUTES } from "../../utils/constants";
import { Tab, TabsContainer } from "../../components/Tab";
import BannerPageError from "../../components/BannerPageError";
import { userSessionAtom } from "../../state/users";
import { groupSessionAtom } from "../../state/groups";
import {
  tasksArrayAtom,
  tasksArrayFilteredAtom,
  tasksMapAtom,
} from "../../state/tasks";
import { TaskAtomType } from "../../types/tasks";
import { isLoadingAPI } from "../../state/app";

const TaskItem = ({ task }: { task: TaskAtomType }) => {
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

const TasksListFilters = () => {
  const [userSession] = useAtom(userSessionAtom);
  const [tasksList] = useAtom(tasksArrayAtom);
  const [, setTasksFiltered] = useAtom(tasksArrayFilteredAtom);

  const [taskFilterWhen, setTaskFilterWhen] = useState<TaskFilterWhenType>(
    TaskFilterWhenType.today
  );
  const [taskFilterWho, setTaskFilterWho] = useState<TaskFilterWhoType>(
    TaskFilterWhoType.me
  );
  const [taskFilterIsCompleted, setTaskFilterIsCompleted] =
    useState<boolean>(false);

  useEffect(() => {
    const filteredTasks = tasksList
      ? tasksList
          .filter((task) => {
            if (taskFilterWhen === TaskFilterWhenType.today) {
              return task.dueDate && isToday(new Date(task.dueDate));
            } else if (taskFilterWhen === TaskFilterWhenType.noDate) {
              return task.dueDate === null;
            }
            return true;
          })
          .filter((task) => {
            if (taskFilterWho === TaskFilterWhoType.me) {
              return task.assigneeId === userSession.id;
            }
            return true;
          })
          .filter((task) => {
            return taskFilterIsCompleted ? task.completed : !task.completed;
          })
      : [];

    setTasksFiltered(filteredTasks);
  }, [tasksList, taskFilterWhen, taskFilterWho, taskFilterIsCompleted]);

  return (
    <>
      <div className={styles.tabsContainerGroup}>
        <TabsContainer>
          <Tab
            onClick={() => setTaskFilterWhen(TaskFilterWhenType.today)}
            current={taskFilterWhen === TaskFilterWhenType.today}
          >
            Today
          </Tab>
          <Tab
            onClick={() => setTaskFilterWhen(TaskFilterWhenType.noDate)}
            current={taskFilterWhen === TaskFilterWhenType.noDate}
          >
            Not planned
          </Tab>
          <Tab
            onClick={() => setTaskFilterWhen(TaskFilterWhenType.all)}
            current={taskFilterWhen === TaskFilterWhenType.all}
          >
            All
          </Tab>
        </TabsContainer>
        <TabsContainer>
          <Tab
            onClick={() => setTaskFilterIsCompleted(false)}
            current={!taskFilterIsCompleted}
          >
            To do
          </Tab>
          <Tab
            onClick={() => setTaskFilterIsCompleted(true)}
            current={taskFilterIsCompleted}
          >
            Completed
          </Tab>
        </TabsContainer>
      </div>
      <TabsContainer>
        <Tab
          onClick={() => setTaskFilterWho(TaskFilterWhoType.me)}
          current={taskFilterWho === TaskFilterWhoType.me}
        >
          Me
        </Tab>
        <Tab
          onClick={() => setTaskFilterWho(TaskFilterWhoType.everyone)}
          current={taskFilterWho === TaskFilterWhoType.everyone}
        >
          Everybody
        </Tab>
      </TabsContainer>
    </>
  );
};

const TasksList = () => {
  const [tasksListFiltered] = useAtom(tasksArrayFilteredAtom);

  return (
    <>
      {!tasksListFiltered ? (
        <BannerPageError />
      ) : (
        <ul className={styles.tasksList}>
          {tasksListFiltered.map((task) => (
            <TaskItem key={task.id} task={task}></TaskItem>
          ))}
        </ul>
      )}
    </>
  );
};

const TasksPage: NextPage = () => {
  const { t } = useLocale();

  const [isLoading, setIsLoading] = useAtom(isLoadingAPI);
  const [groupSession] = useAtom(groupSessionAtom);
  const [, setTasksList] = useAtom(tasksMapAtom);

  useEffect(() => {
    setIsLoading(true);

    const fetchTasks = async () => {
      if (!groupSession?.id) {
        return;
      }

      const rawResponse = await fetch(
        `${ENDPOINTS.tasks}/getAllTasksByGroupId?groupId=${groupSession.id}`,
        {
          method: "GET",
        }
      );
      const res: APIResponseType<Array<TaskAtomType>> =
        await rawResponse.json();

      if (res.success) {
        const tasksListMap: Array<[string, TaskAtomType]> = res.data.map(
          (task) => [task.id, task]
        );
        setTasksList(new Map(tasksListMap));
      } else {
        setTasksList(undefined);
        toast.error(`${t.tasks.errorLoadTasks} (${res.error_type})`);
        console.error("error_type: ", res.error_type);
      }

      setIsLoading(false);
      return;
    };

    fetchTasks();
    return;
  }, [t, groupSession]);

  return (
    <>
      <LayoutAuth>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <TasksListFilters />
            <TasksList />
          </>
        )}
      </LayoutAuth>
    </>
  );
};

export default TasksPage;
