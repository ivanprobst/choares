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
  if (!sessionAndMethodAreValid(req, res, session, "GET")) {
    return;
  }

  const { taskId } = req.query;
  if (!taskId || typeof taskId !== "string") {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.queryInvalid });
  }

  // TODO: check the user is part of the group
  // (otherwise you can't get the task)

  let task = undefined;
  try {
    task = await prisma.task.findUnique({
      where: { id: taskId },
    });
  } catch (e) {
    console.error(e);
  }

  // TODO: if null => record not found
  // if undefined => db read error
  if (!task) {
    return res
      .status(500)
      .json({ success: false, error_type: ERROR_CODES.databaseUnkownError });
  }

  return res.status(200).json({ success: true, data: task });
}
