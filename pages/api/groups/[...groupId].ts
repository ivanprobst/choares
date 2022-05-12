import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ENDPOINTS } from "../../../utils/constants";

import prisma from "../../../utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    groupId: [groupId, subRoute],
  } = req.query as { groupId: Array<string> };
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res
      .status(403)
      .json({ success: false, error_type: "session_invalid" });
  }

  if (!groupId || Array.isArray(groupId)) {
    return res
      .status(400)
      .json({ success: false, error_type: "groupId_not_found" });
  }

  // TODO: check if I own this group (read-only mode?)

  const groupToUpdate = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!groupToUpdate) {
    return res
      .status(400)
      .json({ success: false, error_type: "group_not_found" });
  }

  if (req.method === "GET") {
    await handleGet(req, res);
  } else if (req.method === "POST" && subRoute === ENDPOINTS.subMembers) {
    handlerMemberPost(req, res);
  } else {
    res
      .status(405)
      .json({ success: false, error_type: "unsupported_request_method" });
  }

  return;
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    groupId: [groupId],
  } = req.query as { groupId: Array<string> };

  let group = undefined;
  try {
    group = await prisma.group.findUnique({
      where: { id: groupId as string },
      include: { members: { include: { user: true } } },
    });
  } catch (e) {
    console.error(e);
  }

  if (!group) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_read_error" });
  }

  return res.status(200).json({ success: true, data: group });
};

const handlerMemberPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    groupId: [groupId],
  } = req.query as { groupId: Array<string> };
  const memberData = req.body;
  const session = await getSession({ req });

  let user = undefined;
  try {
    user = await prisma.user.findUnique({
      where: { email: memberData.userEmail },
    });
  } catch (e) {
    console.error(e);
  }

  if (!user) {
    return res
      .status(400)
      .json({ success: false, error_type: "member_not_found" });
  }

  let group = undefined;
  try {
    group = await prisma.group.update({
      where: { id: groupId as string },
      data: {
        members: {
          create: [
            {
              createdBy: session?.user.id as string,
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          ],
        },
      },
    });
  } catch (e) {
    console.error(e);
  }

  if (!group) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_read_error" });
  }

  return res.status(200).json({ success: true, data: group });
};
