import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../utils/prisma";
import { isTaskDataType } from "../../../types";

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

  const { name, description, dueDate } = taskData;
  const computedTaskData = {
    name,
    description,
    dueDate,
    creator: { connect: { id: session?.user?.id } },
    group: { connect: { id: taskData.groupId } },
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

  let getWhere: { where: any } = {
    where: { creator: { id: session?.user?.id } },
  }; // TODO: this default doesn't make much sense
  if (req.query.groupId && typeof req.query.groupId === "string") {
    getWhere = {
      where: { group: { id: req.query.groupId } },
    };
  }

  let tasks = undefined;
  try {
    tasks = await prisma.task.findMany(getWhere);
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
