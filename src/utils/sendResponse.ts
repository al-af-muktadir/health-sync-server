import { Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
};

type TRespose<T> = {
  statusCode: number;
  message: string;
  data: T;
  meta?: TMeta;
};

export const sendResponse = <T>(res: Response, data: TRespose<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: true,
    message: data.message,
    data: data.data,
    meta: data?.meta,
  });
};
