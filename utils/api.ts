import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { ValidSessionType } from "../types/users";
import { ERROR_CODES } from "./constants";

export const sessionAndMethodAreValid = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null,
  expectedMethod: string
): session is ValidSessionType => {
  if (req.method !== expectedMethod) {
    res.status(405).json({
      success: false,
      error_type: ERROR_CODES.unsupportedRequestMethod,
    });

    return false;
  }

  if (!session || !session.user) {
    res
      .status(401)
      .json({ success: false, error_type: ERROR_CODES.sessionInvalid });

    return false;
  }

  return true;
};
