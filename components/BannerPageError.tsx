import { useRouter } from "next/router";
import useLocale from "../state/useLocale";
import Button from "./Button";

const BannerPageError = () => {
  const { t } = useLocale();
  const router = useRouter();

  const moveToListHandler = () => {
    router.push("/tasks-list");
  };

  return (
    <>
      <p>{t.tasks.noTasksFound}.</p>
      <Button onClick={moveToListHandler} type="blue">
        {t.tasks.backTasksList}
      </Button>
    </>
  );
};

export default BannerPageError;
