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
  if (!sessionAndMethodAreValid(req, res, session, "DELETE")) {
    return;
  }

  const { taskId } = req.query;
  if (!taskId || typeof taskId !== "string") {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.queryInvalid });
  }

  // We fetch the task first, to see if
  // there is a recurringId
  let taskToDelete = undefined;
  try {
    taskToDelete = await prisma.task.findUnique({
      where: { id: taskId },
    });
  } catch (e) {
    console.error(e);
  }

  if (taskToDelete === null) {
    return res
      .status(404)
      .json({ success: false, error_type: ERROR_CODES.taskNotFound });
  } else if (!taskToDelete) {
    return res
      .status(500)
      .json({ success: false, error_type: ERROR_CODES.databaseUnkownError });
  }

  // TODO: check the user is part of the group
  // (otherwise you can't delete the task)

  let task = undefined;
  try {
    if (taskToDelete.recurringId) {
      task = await prisma.task.deleteMany({
        where: { recurringId: taskToDelete.recurringId },
      });
    } else {
      task = await prisma.task.delete({
        where: { id: taskId },
      });
    }
  } catch (e) {
    console.error(e);
  }

  // TODO: task can be either the task or an array
  // Prepare for both cases
  if (!task) {
    return res
      .status(500)
      .json({ success: false, error_type: ERROR_CODES.databaseUnkownError });
  }

  return res.status(200).json({ success: true });
}
