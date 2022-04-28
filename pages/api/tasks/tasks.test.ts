import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

import handler from "./index";
import handlerQueryParam from "./[taskId]";

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
  let taskId: string;

  beforeAll(async () => {
    const task = await prisma.task.create({
      data: { name: "THIS TASK IS CREATED FOR TEST PURPOSE" },
    });
    taskId = task.id;
  });

  beforeEach(() => {
    res = mockResponse();
  });

  describe("handles GET requests, and...", () => {
    it("should return whatever is in the DB", async () => {
      const req = mockRequest("GET");

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("handles GET requests with query param, and...", () => {
    it("should return 400 when empty id", async () => {
      const req = mockRequest("GET", undefined, "");

      await handlerQueryParam(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "taskId_not_found",
      });
    });

    it("should return 200 when correct id", async () => {
      const req = mockRequest("GET", undefined, { taskId });

      await handlerQueryParam(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe("handles PUT requests with query param, and...", () => {
    it("should return 400 when empty id", async () => {
      const req = mockRequest("PUT", { description: "" }, "");

      await handlerQueryParam(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "taskId_not_found",
      });
    });

    it("should return 400 when empty data", async () => {
      const req = mockRequest("PUT", undefined, { taskId });

      await handlerQueryParam(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "data_not_found",
      });
    });

    it("should return 400 when wrong data", async () => {
      const req = mockRequest("PUT", { wrongdatakey: "bla" }, { taskId });

      await handlerQueryParam(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "data_format_incorrect",
      });
    });

    it("should return 200 when correct id and data", async () => {
      const req = mockRequest("PUT", { description: "bla" }, { taskId });

      await handlerQueryParam(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe("handles DELETE requests with query param, and...", () => {
    it("should return 400 when empty id", async () => {
      const req = mockRequest("DELETE", undefined, "");

      await handlerQueryParam(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "taskId_not_found",
      });
    });

    it("should return 200 when correct id", async () => {
      const req = mockRequest("DELETE", undefined, { taskId });

      await handlerQueryParam(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe("handles POST requests, and...", () => {
    it("should return 400 when missing data sent from client", async () => {
      const req = mockRequest("POST");

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "data_not_found",
      });
    });

    it("should return 400 when faulty data sent from client", async () => {
      const req = mockRequest("POST", { data: "bad data" });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "data_format_incorrect",
      });
    });

    it("should return 500 when faulty data sent from client", async () => {
      const req = mockRequest("POST", {
        name: "testname",
        bla: "testdesc",
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "database_write_error",
      });
    });

    it("should return 200 when data correct...", async () => {
      const req = mockRequest("POST", {
        name: "testname",
        description: "testdesc",
      });

      // TODO: Add stubbing to prevent database write

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe("handles other requests, and...", () => {
    it("should return 405", async () => {
      const req = mockRequest("PUT");

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error_type: "unsupported_request_method",
      });
    });
  });
});
