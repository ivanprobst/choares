import type { NextPage } from "next";
import Layout from "../../components/layout";
import useLocale from "../../state/useLocale";

const NewTask: NextPage = () => {
  const { t } = useLocale();

  return <Layout>{t.tasks.newTask}</Layout>;
};

export default NewTask;
