import { useRouter } from "next/router";
import useLocale from "../state/useLocale";
import { ROUTES } from "../utils/constants";
import Button from "./Button";

const BannerPageError = () => {
  const { t } = useLocale();
  const router = useRouter();

  const moveToListHandler = () => {
    router.push(ROUTES.tasksList);
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
