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

  let groups = undefined;
  try {
    groups = await prisma.group.findMany({
      where: { members: { some: { userId: session.user.id } } },
      include: { members: { include: { user: true } } },
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }

  if (!groups) {
    return res
      .status(500)
      .json({ success: false, error_type: ERROR_CODES.databaseUnkownError });
  }

  return res.status(200).json({ success: true, data: groups });
}
