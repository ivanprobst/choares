import { useRouter } from "next/router";
import { useAtom } from "jotai";

import styles from "../styles/Groups.module.scss";
import { ROUTES } from "../utils/constants";
import { GroupAtomType } from "../types/groups";
import { groupSessionAtom } from "../state/groups";
import useLocale from "../hooks/useLocale";

export const GroupListItem = ({ group }: { group: GroupAtomType }) => {
  const { t } = useLocale();
  const router = useRouter();

  const [groupSession] = useAtom(groupSessionAtom);

  const openGroupHandler = () => {
    router.push(`${ROUTES.group}/${group.id}`);
  };

  return (
    <li className={styles.groupListItem} onClick={openGroupHandler}>
      <h3>
        {group.name}
        {groupSession?.id === group.id ? ` (${t.common.current})` : ""}
      </h3>
      <p>
        {`${t.groups.members}: `}
        {group.members?.length > 0
          ? group.members.map((member) => member.user.name).join(", ")
          : t.groups.noMembers}
      </p>
    </li>
  );
};
