import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { isToday } from "date-fns";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import { TaskFilterWhenType, TaskFilterWhoType } from "../../types/tasks";
import Spinner from "../../components/Spinner";
import { ENDPOINTS } from "../../utils/constants";
import { Tab, TabsContainer } from "../../components/Tab";
import BannerPageError from "../../components/BannerPageError";
import { isLoadingAPIAtom } from "../../state/app";
import { userSessionAtom } from "../../state/users";
import { groupSessionAtom } from "../../state/groups";
import {
  tasksArrayAtom,
  tasksArrayFilteredAtom,
  tasksMapAtom,
} from "../../state/tasks";
import { TaskAtomType } from "../../types/tasks";
import { useAPI } from "../../hooks/useAPI";
import { TaskListItem } from "../../components/TaskListItem";

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
  }, [
    tasksList,
    taskFilterWhen,
    taskFilterWho,
    taskFilterIsCompleted,
    setTasksFiltered,
    userSession.id,
  ]);

  return (
    <>
      <div>
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
        <ul>
          {tasksListFiltered.map((task) => (
            <TaskListItem key={task.id} task={task}></TaskListItem>
          ))}
        </ul>
      )}
    </>
  );
};

const TasksPage: NextPage = () => {
  const [isLoading] = useAtom(isLoadingAPIAtom);
  const [groupSession] = useAtom(groupSessionAtom);
  const [, setTasksList] = useAtom(tasksMapAtom);

  const processSuccess = (data: Array<TaskAtomType>) => {
    const tasksListMap: Array<[string, TaskAtomType]> = data.map((task) => [
      task.id,
      task,
    ]);
    setTasksList(new Map(tasksListMap));
    return;
  };

  useAPI<Array<TaskAtomType>>({
    endpoint: `${ENDPOINTS.tasks}/getAllTasksByGroupId?groupId=${groupSession?.id}`,
    method: "GET",
    processSuccess,
  });

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
