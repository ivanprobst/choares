import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Link href="/tasks-list">Go to task list</Link>
    </Layout>
  );
};

export default Home;
