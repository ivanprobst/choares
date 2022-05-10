import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { isGroupCreationType } from "../../../types";

import prisma from "../../../utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await handleGet(req, res);
  } else if (req.method === "POST") {
    await handlePost(req, res);
  } else {
    res
      .status(405)
      .json({ success: false, error_type: "unsupported_request_method" });
  }

  return;
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info("body: ", req.body);
  const groupData = req.body;
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res
      .status(403)
      .json({ success: false, error_type: "session_invalid" });
  }

  if (!groupData) {
    return res
      .status(400)
      .json({ success: false, error_type: "data_not_found" });
  }

  if (!isGroupCreationType(groupData)) {
    return res
      .status(400)
      .json({ success: false, error_type: "data_format_incorrect" });
  }

  const computedGroupData = {
    ...groupData,
    creator: { connect: { id: session.user.id } },
    members: {
      create: [
        {
          createdBy: session.user.id,
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      ],
    },
  };

  let task = undefined;
  try {
    task = await prisma.group.create({
      data: computedGroupData,
    });
  } catch (e) {
    console.error(e);
  }

  if (!task) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_write_error" });
  }

  return res.status(200).json({ success: true, data: task });
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res
      .status(403)
      .json({ success: false, error_type: "session_invalid" });
  }

  let groups = undefined;
  try {
    groups = await prisma.group.findMany({
      where: { creator: { id: session.user.id } },
      include: { members: { include: { user: true } } },
    });
  } catch (e) {
    console.log(e);
  }

  if (!groups) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_read_error" });
  }

  return res.status(200).json({ success: true, data: groups });
};
