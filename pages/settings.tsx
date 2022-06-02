import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { signOut } from "next-auth/react";

import styles from "../styles/Settings.module.scss";
import useLocale from "../hooks/useLocale";
import LayoutAuth from "../components/LayoutAuth";
import Spinner from "../components/Spinner";
import { isLoadingAPIAtom } from "../state/app";
import Button from "../components/Button";
import { ROUTES } from "../utils/constants";

const SettingsActions = () => {
  const { t } = useLocale();
  const router = useRouter();

  const [isLoadingAPI] = useAtom(isLoadingAPIAtom);

  return (
    <div>
      <Button
        onClick={() => router.push(ROUTES.groups)}
        type="blue"
        isLoading={isLoadingAPI}
      >
        {t.groups.manageGroups}
      </Button>

      <Button onClick={() => signOut()} type="red" isLoading={isLoadingAPI}>
        {t.common.signout}
      </Button>
    </div>
  );
};

const SettingsPage: NextPage = () => {
  const { t } = useLocale();
  const [isLoadingAPI] = useAtom(isLoadingAPIAtom);

  return (
    <>
      <LayoutAuth>
        {isLoadingAPI ? (
          <Spinner />
        ) : (
          <div className={styles.settingsContainer}>
            <h2>{t.settings.title}</h2>
            <SettingsActions />
            <p>{t.about.copyright}</p>
          </div>
        )}
      </LayoutAuth>
    </>
  );
};

export default SettingsPage;
