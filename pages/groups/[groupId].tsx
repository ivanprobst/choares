import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAtom } from "jotai";

import LayoutAuth from "../../components/LayoutAuth";
import useLocale from "../../hooks/useLocale";
import { ENDPOINTS } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import BannerPageError from "../../components/BannerPageError";
import { groupAtom, groupsMapAtom } from "../../state/groups";
import { isLoadingAPIAtom } from "../../state/app";
import { GroupAtomType } from "../../types/groups";
import { useAPI } from "../../hooks/useAPI";
import { GroupActions, GroupDetails } from "../../components/GroupDetails";

const GroupPage: NextPage = () => {
  const { t } = useLocale();
  const { query, isReady } = useRouter();

  const [isLoadingAPI, setIsLoadingAPI] = useAtom(isLoadingAPIAtom);
  const [groupsMap] = useAtom(groupsMapAtom);
  const [group, setGroup] = useAtom(groupAtom);

  const { runFetch } = useAPI<GroupAtomType>({ mode: "manual" });

  useEffect(() => {
    const processSuccess = (data: GroupAtomType) => {
      setGroup(data);
      return;
    };

    setIsLoadingAPI(true);

    if (!isReady) {
      return; // TODO: Display some kind of error
    }

    const { groupId } = query;
    if (!groupId || Array.isArray(groupId)) {
      setIsLoadingAPI(false);
      return; // TODO: Display some kind of error
    }

    const groupCached = groupsMap?.get(groupId);
    if (!groupCached) {
      runFetch({
        endpoint: `${ENDPOINTS.groups}/getGroupById?groupId=${groupId}`,
        method: "GET",
        processSuccess,
      });
    } else {
      setGroup(groupCached);
      setIsLoadingAPI(false);
    }

    return;
  }, [t, query, groupsMap, isReady, runFetch, setGroup, setIsLoadingAPI]);

  return (
    <LayoutAuth>
      {isLoadingAPI ? (
        <Spinner />
      ) : !group ? (
        <BannerPageError />
      ) : (
        <>
          <GroupDetails />
          <GroupActions />
        </>
      )}
    </LayoutAuth>
  );
};

export default GroupPage;
