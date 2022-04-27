import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await handleGet(req, res);
  } else {
    res
      .status(405)
      .json({ success: false, error_type: "unsupported_request_method" });
  }

  return;
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { taskId } = req.query;
  console.log("taskId: ", taskId);

  if (!taskId || Array.isArray(taskId)) {
    return res
      .status(400)
      .json({ success: false, error_type: "taskId_not_found" });
  }

  let tasks = undefined;
  try {
    tasks = await prisma.task.findUnique({ where: { id: taskId } });
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
