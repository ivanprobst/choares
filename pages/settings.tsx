import type { NextPage } from "next";
import { useAtom } from "jotai";
import { signOut } from "next-auth/react";

import useLocale from "../hooks/useLocale";
import LayoutAuth from "../components/LayoutAuth";
import Spinner from "../components/Spinner";
import { isLoadingAPIAtom } from "../state/app";

const SettingsPage: NextPage = () => {
  const { t } = useLocale();
  const [isLoading] = useAtom(isLoadingAPIAtom);

  return (
    <>
      <LayoutAuth>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <p>Settings</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              {t.common.signout}
            </a>
          </>
        )}
      </LayoutAuth>
    </>
  );
};

export default SettingsPage;
