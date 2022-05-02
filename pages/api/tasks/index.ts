import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../utils/prisma";
import { isTaskDataType } from "../../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res
      .status(403)
      .json({ success: false, error_type: "session_invalid" });
  }

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
  const taskData = req.body;
  const session = await getSession({ req });

  if (!taskData) {
    return res
      .status(400)
      .json({ success: false, error_type: "data_not_found" });
  }

  if (!isTaskDataType(taskData)) {
    return res
      .status(400)
      .json({ success: false, error_type: "data_format_incorrect" });
  }

  const computedTaskData = {
    ...taskData,
    creator: { connect: { id: session?.user?.id } },
  };

  let task = undefined;
  try {
    task = await prisma.task.create({
      data: computedTaskData,
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

  let tasks = undefined;
  try {
    tasks = await prisma.task.findMany({
      where: { creator: { id: session?.user?.id } },
    });
  } catch (e) {
    console.log(e);
  }

  if (!tasks) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_read_error" });
  }

  return res.status(200).json({ success: true, data: tasks });
};
