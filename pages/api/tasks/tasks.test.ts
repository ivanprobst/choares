import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

import prisma from "../../../utils/prisma";
import { ERROR_CODES } from "../../../utils/constants";

import * as moduleNextAuth from "next-auth/react";
import createTask from "./createTask";
import deleteTaskById from "./deleteTaskById";
import getAllTasksByGroupId from "./getAllTasksByGroupId";
import getTaskById from "./getTaskById";
import updateTask from "./updateTask";

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

describe("the API /tasks...", () => {
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

  // TODO: add test for recurring create
  describe("handles createTask requests, and...", () => {
    it("should fail if taskData is not valid (missing mandatory prop)", async () => {
      const body = { description: "Task without a name" };
      const req = mockRequest("POST", body);

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.dataFormatIncorrect,
      });
    });

    it("should fail if taskData is not valid (wrong prop name)", async () => {
      const body = {
        name: "Task name",
        groupId: "groupId",
        wrongProp: "this prop is not valid",
      };
      const req = mockRequest("POST", body);

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.dataFormatIncorrect,
      });
    });

    it("should succeed if all is valid", async () => {
      const body = {
        name: "Task name",
        groupId: "groupId",
      };
      const req = mockRequest("POST", body);

      jest
        .spyOn(prisma.task, "create")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "taskId" }));

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  // TODO: add test for recurring delete
  describe("handles deleteTaskById requests, and...", () => {
    it("should fail if no taskId passed in query", async () => {
      const req = mockRequest("DELETE", null, { notaskId: "none" });

      await deleteTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.queryInvalid,
      });
    });

    it("should fail if the task to delete is not found", async () => {
      const req = mockRequest("DELETE", null, { taskId: "taskId" });

      jest
        .spyOn(prisma.task, "findUnique")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve(null));

      await deleteTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.taskNotFound,
      });
    });

    it("should succeed if all is valid", async () => {
      const req = mockRequest("DELETE", null, { taskId: "taskId" });

      jest
        .spyOn(prisma.task, "findUnique")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "taskId" }));

      jest
        .spyOn(prisma.task, "delete")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "taskId" }));

      await deleteTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe("handles getAllTasksByGroupId requests, and...", () => {
    it("should fail if no groupId passed in query", async () => {
      const req = mockRequest("GET", null, { noGroupId: "none" });

      await getAllTasksByGroupId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.queryInvalid,
      });
    });

    it("should succeed if all is valid", async () => {
      const req = mockRequest("GET", null, { groupId: "groupId" });

      jest
        .spyOn(prisma.task, "findMany")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve(["task1", "task2"]));

      await getAllTasksByGroupId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: ["task1", "task2"],
      });
    });
  });

  describe("handles getTaskById requests, and...", () => {
    it("should fail if no taskId passed in query", async () => {
      const req = mockRequest("GET", null, { noTaskId: "none" });

      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.queryInvalid,
      });
    });

    it("should succeed if all is valid", async () => {
      const req = mockRequest("GET", null, { taskId: "taskId" });

      jest
        .spyOn(prisma.task, "findUnique")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "task1" }));

      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: "task1" },
      });
    });
  });

  describe("handles updateTask requests, and...", () => {
    it("should fail if no taskId passed in query", async () => {
      const req = mockRequest("PUT", null, { noTaskId: "none" });

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.queryInvalid,
      });
    });

    it("should fail if taskData is not valid (wrong prop name)", async () => {
      const body = { wrongProp: "this prop is not valid" };
      const req = mockRequest("PUT", body, { taskId: "taskId" });

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: ERROR_CODES.dataFormatIncorrect,
      });
    });

    it("should succeed if all is valid", async () => {
      const body = { completed: true };
      const req = mockRequest("PUT", body, { taskId: "taskId" });

      jest
        .spyOn(prisma.task, "update")
        // @ts-expect-error actually works as expected
        .mockImplementation(() => Promise.resolve({ id: "taskId" }));

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: "taskId" },
      });
    });
  });
});
