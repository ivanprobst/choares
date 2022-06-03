import type { NextPage } from "next";

import LayoutAuth from "../../components/LayoutAuth";
import { FormCreateTask } from "../../components/FormCreateTask";

const CreateTaskPage: NextPage = () => {
  return (
    <LayoutAuth>
      <FormCreateTask />
    </LayoutAuth>
  );
};

export default CreateTaskPage;
