import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../utils/prisma";
import { sessionAndMethodAreValid } from "../../../utils/api";
import { ERROR_CODES } from "../../../utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!sessionAndMethodAreValid(req, res, session, "PUT")) {
    return;
  }

  const { taskId } = req.query;
  if (!taskId || typeof taskId !== "string") {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.queryInvalid });
  }

  const taskData = req.body;
  if (!taskData || !taskDataIsValid(taskData)) {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.dataFormatIncorrect });
  }

  // TODO: check the user is part of the group
  // (otherwise you can't delete the task)

  let task = undefined;
  try {
    task = await prisma.task.update({
      where: { id: taskId },
      data: taskData,
    });
  } catch (e) {
    console.error(e);
  }

  if (!task) {
    return res
      .status(500)
      .json({ success: false, error_type: ERROR_CODES.databaseUnkownError });
  }

  return res.status(200).json({ success: true, data: task });
}

// TODO: add type check for each key,
// and make the function generic
const taskDataIsValid = (data: any) => {
  const optionalProps = new Set(["dueDate", "completed", "assignee"]);

  const propsAreValid = Object.keys(data).every((key) => {
    return optionalProps.has(key);
  });

  return propsAreValid;
};
