import { useRouter } from "next/router";

import styles from "../styles/Tasks.module.scss";
import useLocale from "../hooks/useLocale";
import { ROUTES } from "../utils/constants";
import { TaskAtomType } from "../types/tasks";
import { toHumanDate } from "../utils/dates";
import { IconClock } from "../icons/IconClock";

export const TaskListItem = ({ task }: { task: TaskAtomType }) => {
  const { t } = useLocale();
  const router = useRouter();

  const openTaskHandler = () => {
    router.push(`${ROUTES.task}/${task.id}`);
  };

  return (
    <li className={styles.tasksListItem} onClick={openTaskHandler}>
      <div>
        <h3>{task.name}</h3>
        <p className={styles.dueDate}>
          <IconClock />
          {`${t.tasks.dueBy}: ${
            task.dueDate ? toHumanDate(task.dueDate) : "-"
          }`}
        </p>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
      </div>
    </li>
  );
};
