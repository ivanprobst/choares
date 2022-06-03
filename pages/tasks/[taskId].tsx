import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import useLocale from "../../hooks/useLocale";
import { ENDPOINTS } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import BannerPageError from "../../components/BannerPageError";
import { taskAtom, tasksMapAtom } from "../../state/tasks";
import { isLoadingAPIAtom } from "../../state/app";
import { TaskAtomType } from "../../types/tasks";
import { useAPI } from "../../hooks/useAPI";
import { TaskActions, TaskDetails } from "../../components/TaskDetails";

const TaskPage: NextPage = () => {
  const { t } = useLocale();
  const { query, isReady } = useRouter();

  const [isLoading, setIsLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [tasksMap] = useAtom(tasksMapAtom);
  const [task, setTask] = useAtom(taskAtom);

  const { runFetch } = useAPI<TaskAtomType>({ mode: "manual" });

  useEffect(() => {
    const processSuccess = (data: TaskAtomType) => {
      setTask(data);
      return;
    };

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
  }, [t, query, isReady, setIsLoadingAPI, setTask, tasksMap, runFetch]);

  return (
    <LayoutAuth>
      {isLoading ? (
        <Spinner />
      ) : !task ? (
        <BannerPageError />
      ) : (
        <>
          <TaskDetails />
          <TaskActions />
        </>
      )}
    </LayoutAuth>
  );
};

export default TaskPage;
