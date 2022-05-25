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

  const { groupId } = req.query;
  if (!groupId || typeof groupId !== "string") {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.queryInvalid });
  }

  // TODO: check the user is part of the group
  // (otherwise you can get any group's tasks,
  // as long as you have the groupId)

  let tasks = undefined;
  try {
    tasks = await prisma.task.findMany({
      where: { group: { id: groupId } },
      orderBy: [
        {
          dueDate: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }

  if (!tasks) {
    return res
      .status(500)
      .json({ success: false, error_type: ERROR_CODES.databaseUnkownError });
  }

  return res.status(200).json({ success: true, data: tasks });
}
