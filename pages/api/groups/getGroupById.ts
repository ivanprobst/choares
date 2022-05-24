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
  // (otherwise you can't get the group)

  let group = undefined;
  try {
    group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { include: { user: true } } },
    });
  } catch (e) {
    console.error(e);
  }

  // TODO: if null => record not found
  // if undefined => db read error
  if (!group) {
    return res
      .status(500)
      .json({ success: false, error_type: ERROR_CODES.databaseUnkownError });
  }

  return res.status(200).json({ success: true, data: group });
}
