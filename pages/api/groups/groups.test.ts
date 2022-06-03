import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

import prisma from "../../../utils/prisma";
import { ERROR_CODES } from "../../../utils/constants";

import * as moduleNextAuth from "next-auth/react";
import getAllGroupsBySessionUserId from "./getAllGroupsBySessionUserId";
import getGroupById from "./getGroupById";
import createGroup from "./createGroup";
import addMemberToGroup from "./addMemberToGroup";

const mockRequest = (method: string, body?: any, query?: any) => {
  return {
    method,
    query,
    body,
  } as NextApiRequest;
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
};

describe("the API /groups...", () => {
  let res: NextApiResponse;

  beforeEach(async () => {
    jest
      .spyOn(moduleNextAuth, "getSession")
      .mockImplementation(() =>
        Promise.resolve({ user: { id: "userId" } } as Session)
      );
    res = mockResponse();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("handles getAllGroupsBySessionUserId requests, and...", () => {
    it("should succeed if all is valid", async () => {
      const req = mockRequest("GET");

      jest
        .spyOn(prisma.group, "findMany")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve(["group1", "group2"]));

      await getAllGroupsBySessionUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: ["group1", "group2"],
      });
    });
  });

  describe("handles getGroupById requests, and...", () => {
    it("should fail if no groupId passed in query", async () => {
      const req = mockRequest("GET", null, { noGroupId: "none" });

      await getGroupById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.queryInvalid,
      });
    });

    it("should succeed if all is valid", async () => {
      const req = mockRequest("GET", null, { groupId: "groupId" });

      jest
        .spyOn(prisma.group, "findUnique")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "group1" }));

      await getGroupById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: "group1" },
      });
    });
  });

  describe("handles createGroup requests, and...", () => {
    it("should fail if body is not valid (missing mandatory prop)", async () => {
      const body = {};
      const req = mockRequest("POST", body);

      await createGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.dataFormatIncorrect,
      });
    });

    it("should fail if body is not valid (wrong prop name)", async () => {
      const body = {
        name: "Group name",
        wrongProp: "this prop is not valid",
      };
      const req = mockRequest("POST", body);

      await createGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.dataFormatIncorrect,
      });
    });

    it("should succeed if all is valid", async () => {
      const body = {
        name: "Group name",
      };
      const req = mockRequest("POST", body);

      jest
        .spyOn(prisma.group, "create")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "groupId" }));

      await createGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: "groupId" },
      });
    });
  });

  describe("handles addMemberToGroup requests, and...", () => {
    it("should fail if no groupId passed in query", async () => {
      const req = mockRequest("PUT", null, { noGroupId: "none" });

      await addMemberToGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.queryInvalid,
      });
    });

    it("should fail if body is not valid (wrong prop name)", async () => {
      const body = { wrongProp: "this prop is not valid" };
      const req = mockRequest("PUT", body, { groupId: "groupId" });

      await addMemberToGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.dataFormatIncorrect,
      });
    });

    it("should fail if userEmail is not found", async () => {
      const body = { userEmail: "wrong@email.com" };
      const req = mockRequest("PUT", body, { groupId: "groupId" });

      jest
        .spyOn(prisma.user, "findUnique")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve(null));

      await addMemberToGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.userNotFound,
      });
    });

    it("should succeed if all is valid", async () => {
      const body = { userEmail: "test@email.com" };
      const req = mockRequest("PUT", body, { groupId: "groupId" });

      jest
        .spyOn(prisma.user, "findUnique")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "userId" }));

      jest
        .spyOn(prisma.group, "update")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "groupId" }));

      await addMemberToGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: "groupId" },
      });
    });
  });
});
