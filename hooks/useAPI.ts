import { useEffect } from "react";
import { useAtom } from "jotai";
import toast from "react-hot-toast";

import useLocale from "../hooks/useLocale";
import { APIResponseType } from "../types";
import { isLoadingAPIAtom } from "../state/app";

interface APIoptions<DataReturnType> {
  method?: string;
  endpoint?: string;
  body?: object;
  processSuccess?: (data: DataReturnType) => void;
  mode?: "auto" | "manual";
}

export const useAPI = <DataReturnType = undefined>({
  endpoint,
  method,
  body,
  processSuccess,
  mode = "auto",
}: APIoptions<DataReturnType>) => {
  const { t } = useLocale();

  const [, setIsLoadingAPI] = useAtom(isLoadingAPIAtom);

  const executeFetch = async ({
    method,
    endpoint,
    body,
    processSuccess,
  }: Omit<APIoptions<DataReturnType>, "mode">) => {
    setIsLoadingAPI(true);

    if (!endpoint || !method) {
      return { success: false };
    }

    const fetchOptions = getFetchOptions(method, body);

    const rawResponse = await fetch(endpoint, fetchOptions);
    const response: APIResponseType<DataReturnType> = await rawResponse.json();

    if (!response.success) {
      console.error("error_type: ", response.error_type);
      toast.error(`${t.common.error}: ${response.error_type}`);
    }

    if (response.success && processSuccess) {
      processSuccess(response.data);
    }

    setIsLoadingAPI(false);
    return { success: response.success };
  };

  useEffect(() => {
    if (mode === "auto") {
      executeFetch({
        endpoint,
        method,
        body,
        processSuccess,
      });
    }
    return;
  }, [endpoint]);

  const runFetch = async (props: Omit<APIoptions<DataReturnType>, "mode">) => {
    return await executeFetch(props);
  };

  return { runFetch };
};

const getFetchOptions = (method: string, body?: object) => {
  const computedHeaders = body
    ? {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    : {};

  const computedBody = body ? { body: JSON.stringify(body) } : {};

  return {
    method,
    ...computedHeaders,
    ...computedBody,
  };
};
