import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../utils/prisma";
import { isTaskDataType } from "../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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

  let task = undefined;
  try {
    task = await prisma.task.create({
      data: taskData,
    });
  } catch (e) {
    console.log(e);
  }

  if (!task) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_write_error" });
  }

  return res.status(200).json({ success: true, data: task });
};
