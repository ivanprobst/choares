import type { NextPage } from "next";
import Link from "next/link";

import Layout from "../components/Layout";
import { ROUTES } from "../utils/constants";

const Home: NextPage = () => {
  return (
    <Layout>
      <Link href={ROUTES.tasksList}>Go to task list</Link>
    </Layout>
  );
};

export default Home;
