import { NextApiRequest, NextApiResponse } from "next";

import handler from "./tasks";

const mockRequest = (requestContent: any) => {
  return {
    ...requestContent,
  } as NextApiRequest;
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
};

describe("the API /tasks...", () => {
  describe("handles POST requests...", () => {
    it("should return 200 for POST requests...", async () => {
      const req = mockRequest({ method: "POST", body: "data" });
      const res = mockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("handles other requests...", () => {
    it("should return 405 for other requests", async () => {
      const req = mockRequest({ method: "PUT" });
      const res = mockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
    });
  });
});
