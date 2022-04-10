import type { NextPage } from "next";
import Layout from "../../components/layout";
import useLocale from "../../state/useLocale";

const Task: NextPage = () => {
  const { t } = useLocale();

  return <Layout>{t.tasks.task}</Layout>;
};

export default Task;