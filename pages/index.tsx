import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <p>Home - list tasks</p>
      <ul>
        <li>
          <Link href="/tasks/task">A task</Link>
        </li>
      </ul>
    </Layout>
  );
};

export default Home;
