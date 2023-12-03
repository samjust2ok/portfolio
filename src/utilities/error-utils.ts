import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getErrorListFromZodErrorObject } from "./helpers";

export class HttpError extends Error {
  constructor(
    private statusCode: number,
    message: string,
    private errors: string[]
  ) {
    super(message);
  }
}

export const Error404 = (postId: string, message?: string) =>
  new HttpError(404, "Not Found", [
    message || "No matching post for id " + postId,
  ]);

export function handleRequestError(error: any) {
  if (error instanceof ZodError)
    return NextResponse.json(
      {
        errors: getErrorListFromZodErrorObject(error),
        message: "Invalid request body",
      },
      { status: 400 }
    );
  else
    return NextResponse.json(
      { errors: error.errors, message: error.message },
      { status: error.statusCode || 500 }
    );
}
