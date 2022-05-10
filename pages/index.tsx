import type { NextPage } from "next";
import Link from "next/link";

import LayoutAuth from "../components/LayoutAuth";
import { ROUTES } from "../utils/constants";

const Home: NextPage = () => {
  return (
    <LayoutAuth>
      <Link href={ROUTES.tasksList}>Go to task list</Link>
    </LayoutAuth>
  );
};

export default Home;
