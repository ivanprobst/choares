import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

import prisma from "../../../utils/prisma";
import { isTaskDataType } from "../../../types";
import { GENERIC } from "../../../utils/constants";
import { addMonths, addWeeks, parseISO } from "date-fns";

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

const createRecurringTasks = async (computedTask: any) => {
  const recurringId = uuidv4();
  const numberOfTasks = Math.round(
    GENERIC.recurringTimeframe / (computedTask.recurring === "weekly" ? 7 : 30)
  );

  const tasks = [];
  for (let taskCount = 0; taskCount < numberOfTasks; taskCount++) {
    let currentDueDate;
    if (computedTask.recurring === "weekly") {
      currentDueDate = addWeeks(parseISO(computedTask.dueDate), taskCount);
    } else {
      currentDueDate = addMonths(parseISO(computedTask.dueDate), taskCount);
    }

    tasks.push({
      ...computedTask,
      dueDate: currentDueDate,
      recurringId,
    });
  }

  const tasksCreated = await Promise.all(
    tasks.map((task) =>
      prisma.task.create({
        data: task,
      })
    )
  );

  return tasksCreated;
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info("POST task: ", req.body);
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

  const { name, description, dueDate, recurring, assigneeId, groupId } =
    taskData;
  const assignee = assigneeId
    ? { assignee: { connect: { id: taskData.assigneeId } } }
    : {};
  const computedTaskData = {
    name,
    description,
    dueDate,
    recurring,
    creator: { connect: { id: session?.user?.id } },
    group: { connect: { id: groupId } },
    ...assignee,
  };

  let task = undefined;
  try {
    if (recurring) {
      task = await createRecurringTasks(computedTaskData);
    } else {
      task = await prisma.task.create({
        data: computedTaskData,
      });
    }
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
    console.error(e);
  }

  if (!tasks) {
    return res
      .status(500)
      .json({ success: false, error_type: "database_read_error" });
  }

  return res.status(200).json({ success: true, data: tasks });
};
