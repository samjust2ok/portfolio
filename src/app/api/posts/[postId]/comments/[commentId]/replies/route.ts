import {
  CommentValidationSchema,
  IdValidationSchema,
} from "@/app/constants/validation-schemas";
import { handleRequestError, HttpError } from "@/app/utilities/error-utils";
import { isValidObjectId } from "@/app/utilities/helpers";
import { connect } from "@/database/connection";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    postId: string;
    commentId: string;
  };
};

const Error404 = (postId: string, message?: string) =>
  new HttpError(404, "Not Found", [
    message || "No matching post for id " + postId,
  ]);

export async function POST(request: NextRequest, context: Context) {
  try {
    await connect();

    const postId = context.params.postId;
    const commentId = context.params.commentId;
    const replyData = await request.json();

    CommentValidationSchema.parse(replyData);
    IdValidationSchema.parse(postId);
    IdValidationSchema.parse(commentId);

    const reply = {
      ...replyData,
      date_created: new Date().toISOString(),
    };

    const query = isValidObjectId(postId) ? { _id: postId } : { id: postId };

    let updatedPost = await Post.findOneAndUpdate(
      { ...query, "comments._id": commentId },
      { $push: { "comments.$.replies": reply } },
      { new: true }
    );

    if (!updatedPost) throw Error404(postId);
    return NextResponse.json({
      data: updatedPost.comments
        .find((comment: any) => comment._id.toString() === commentId)
        ?.replies.at(-1),
    });
  } catch (error) {
    console.log(error);
    return handleRequestError(error);
  }
}
