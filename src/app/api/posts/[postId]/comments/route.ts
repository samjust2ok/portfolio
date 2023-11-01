import { Comment } from "@/app/constants/interfaces";
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
    const commentData = await request.json();

    CommentValidationSchema.parse(commentData);
    IdValidationSchema.parse(postId);

    const comment = {
      ...commentData,
      date_created: new Date().toISOString(),
    };

    const query = isValidObjectId(postId) ? { _id: postId } : { id: postId };
    const updatedComment = await Post.findOneAndUpdate(
      query,
      {
        $push: { comments: comment },
      },
      { new: true }
    );

    if (!updatedComment) throw Error404(postId);
    return NextResponse.json({
      data: updatedComment.comments.at(-1),
    });
  } catch (error) {
    return handleRequestError(error);
  }
}

function sortByDate(a: any, b: any) {
  return b.date_created.valueOf() - a.date_created.valueOf();
}

export async function GET(request: Request, context: Context) {
  try {
    await connect();

    const postId = context.params.postId;

    IdValidationSchema.parse(postId);

    const query = isValidObjectId(postId) ? { _id: postId } : { id: postId };
    const post = await Post.findOne(query);

    if (!post) throw Error404(postId);

    post.comments
      .sort(sortByDate)
      .map((comment: any) => comment.replies.sort(sortByDate));

    return NextResponse.json({ data: post.comments });
  } catch (error) {
    return handleRequestError(error);
  }
}
