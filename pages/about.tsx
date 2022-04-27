import type { NextPage } from "next";
import Layout from "../components/Layout";
import useLocale from "../state/useLocale";

const About: NextPage = () => {
  const { t } = useLocale();

  return (
    <Layout>
      <div>{t.about.copyright}</div>
      <div>
        <a
          href="https://ivanprobst.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.about.website}
        </a>
        &nbsp;|&nbsp;
        <a
          href="https://github.com/ivanprobst"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.about.github}
        </a>
      </div>
    </Layout>
  );
};

export default About;
