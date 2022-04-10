import type { NextPage } from "next";
import Layout from "../components/layout";
import useLocale from "../state/useLocale";

const Settings: NextPage = () => {
  const { t } = useLocale();

  return <Layout>{t.settings.title}</Layout>;
};

export default Settings;
