import type { NextPage } from "next";
import Layout from "../components/layout";

const About: NextPage = () => {
  return (
    <Layout>
      <div>© 2022, created by IvanProbst</div>
      <div>
        <a
          href="https://ivanprobst.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ivanprobst.com
        </a>
        &nbsp;|&nbsp;
        <a
          href="https://github.com/ivanprobst"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </Layout>
  );
};

export default About;
