import type { NextPage } from "next";

import LayoutAuth from "../../components/LayoutAuth";
import { FormCreateGroup } from "../../components/FormCreateGroup";

const GroupCreatePage: NextPage = () => {
  return (
    <LayoutAuth>
      <FormCreateGroup />
    </LayoutAuth>
  );
};

export default GroupCreatePage;
