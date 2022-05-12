import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../utils/prisma";
import { isTaskUpdateType } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { taskId } = req.query;
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res
      .status(403)
      .json({ success: false, error_type: "session_invalid" });
  }

  if (!taskId || Array.isArray(taskId)) {
    return res
      .status(400)
      .json({ success: false, error_type: "taskId_not_found" });
  }

  const taskToUpdate = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!taskToUpdate) {
    return res
      .status(400)
      .json({ success: false, error_type: "task_not_found" });
  }

  if (req.method === "GET") {
    await handleGet(req, res);
  } else if (req.method === "PUT") {
    await handlePut(req, res);
  } else if (req.method === "DELETE") {
    await handleDelete(req, res);
  } else {
    res
      .status(405)
      .json({ success: false, error_type: "unsupported_request_method" });
  }

  return;
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { taskId } = req.query;

  let task = undefined;
  try {
    task = await prisma.task.findUnique({
      where: { id: taskId as string },
    });
  } catch (e) {
    console.error(e);
  }

  if (!task) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_read_error" });
  }

  return res.status(200).json({ success: true, data: task });
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info("body: ", req.body);
  const { taskId } = req.query;
  const taskData = req.body;

  // TODO: prevent non-creator to update the task
  // if (taskToUpdate.creatorId !== session.user.id) {
  //   return res
  //     .status(403)
  //     .json({ success: false, error_type: "user_missing_rights" });
  // }

  if (!taskData) {
    return res
      .status(400)
      .json({ success: false, error_type: "data_not_found" });
  }

  if (!isTaskUpdateType(taskData)) {
    return res
      .status(400)
      .json({ success: false, error_type: "data_format_incorrect" });
  }

  let task = undefined;
  try {
    task = await prisma.task.update({
      where: { id: taskId as string },
      data: taskData,
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

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { taskId } = req.query;

  // TODO: prevent non-creator to delete the task
  // if (taskToUpdate.creatorId !== session.user.id) {
  //   return res
  //     .status(403)
  //     .json({ success: false, error_type: "user_missing_rights" });
  // }

  let task = undefined;
  try {
    task = await prisma.task.delete({
      where: { id: taskId as string },
    });
  } catch (e) {
    console.error(e);
  }

  if (!task) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_delete_error" });
  }

  return res.status(200).json({ success: true, data: task });
};
