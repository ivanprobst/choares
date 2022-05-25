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
  if (!sessionAndMethodAreValid(req, res, session, "POST")) {
    return;
  }

  const groupData = req.body;
  if (!groupDataIsValid(groupData)) {
    return res
      .status(400)
      .json({ success: false, error_type: ERROR_CODES.dataFormatIncorrect });
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

  let group = undefined;
  try {
    group = await prisma.group.create({
      data: computedGroupData,
    });
  } catch (e) {
    console.error(e);
  }

  if (!group) {
    return res.status(500).json({
      success: false,
      error_type: ERROR_CODES.databaseUnkownError,
    });
  }

  return res.status(200).json({ success: true, data: group });
}

// TODO: add type check for each key,
// and make the function generic
const groupDataIsValid = (data: any) => {
  const mandatoryProps = new Set(["name"]);

  const propsAreValid = Object.keys(data).every((key) => {
    if (mandatoryProps.has(key)) {
      mandatoryProps.delete(key);
      return true;
    }

    return false;
  });

  return propsAreValid && mandatoryProps.size === 0;
};
