import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/layout";
import useLocale from "../state/useLocale";

const Home: NextPage = () => {
  const { t } = useLocale();

  return (
    <>
      <Layout>
        <h2>{t.tasks.tasksList}</h2>
        <ul>
          <li>
            <Link href="/tasks/task">{t.tasks.task}</Link>
          </li>
        </ul>
      </Layout>
    </>
  );
};

export default Home;
