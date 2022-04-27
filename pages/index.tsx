import type { NextPage } from "next";
import TasksListPage from "./tasks/tasks-list";

const Home: NextPage = () => {
  return (
    <>
      <TasksListPage />
    </>
  );
};

export default Home;
