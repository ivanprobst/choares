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

  const { groupId } = req.query;
  if (!groupId || typeof groupId !== "string") {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.queryInvalid });
  }

  const groupData = req.body;
  if (!groupData || !groupDataIsValid(groupData)) {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.dataFormatIncorrect });
  }

  // TODO: check the user is part of the group
  // (otherwise you can't delete the task)

  let user = undefined;
  try {
    user = await prisma.user.findUnique({
      where: { email: groupData.userEmail },
    });
  } catch (e) {
    console.error(e);
  }

  if (!user) {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.userNotFound });
  }

  let group = undefined;
  try {
    group = await prisma.group.update({
      where: { id: groupId as string },
      data: {
        members: {
          create: [
            {
              createdBy: session.user.id as string,
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          ],
        },
      },
      include: { members: { include: { user: true } } },
    });
  } catch (e) {
    console.error(e);
  }

  if (!group) {
    return res
      .status(500)
      .json({ success: false, error_type: ERROR_CODES.databaseUnkownError });
  }

  return res.status(200).json({ success: true, data: group });
}

const groupDataIsValid = (data: any) => {
  return !!data.userEmail;
};
