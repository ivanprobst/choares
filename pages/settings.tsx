import type { NextPage } from "next";

import Layout from "../components/Layout";
import useLocale from "../state/useLocale";

const Settings: NextPage = () => {
  const { t } = useLocale();

  return (
    <Layout>
      <h2>{t.settings.title}</h2>
      <p>No settings for now</p>
    </Layout>
  );
};

export default Settings;
