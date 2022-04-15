import { NextApiRequest, NextApiResponse } from "next";

import handler from "./tasks";

const mockRequest = (method: string, body?: any) => {
  return {
    method,
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

  beforeAll(() => {
    res = mockResponse();
  });

  describe("handles POST requests, and...", () => {
    it("should return 400 when missing data sent from client", async () => {
      const req = mockRequest("POST", undefined);

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
