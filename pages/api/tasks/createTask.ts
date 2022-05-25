import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { addMonths, addWeeks, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import prisma from "../../../utils/prisma";
import { sessionAndMethodAreValid } from "../../../utils/api";
import { GENERIC, ERROR_CODES } from "../../../utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!sessionAndMethodAreValid(req, res, session, "POST")) {
    return;
  }

  const taskData = req.body;
  if (!taskDataIsValid(taskData)) {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.dataFormatIncorrect });
  }

  // TODO: check the user is part of the group
  // (otherwise you can't create a task)

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
    creator: { connect: { id: session.user.id } },
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

  // TODO: task can be either the task or an array
  // Prepare for both cases
  if (!task) {
    return res.status(500).json({
      success: false,
      error_type: ERROR_CODES.databaseUnkownError,
    });
  }

  return res.status(200).json({ success: true });
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

// TODO: add type check for each key,
// and make the function generic
const taskDataIsValid = (data: any) => {
  const mandatoryProps = new Set(["name", "groupId"]);
  const optionalProps = new Set([
    "description",
    "dueDate",
    "recurring",
    "assigneeId",
  ]);

  const propsAreValid = Object.keys(data).every((key) => {
    if (mandatoryProps.has(key)) {
      mandatoryProps.delete(key);
      return true;
    }

    return optionalProps.has(key);
  });

  return propsAreValid && mandatoryProps.size === 0;
};
