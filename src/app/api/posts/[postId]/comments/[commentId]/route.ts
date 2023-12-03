import {
  IdValidationSchema,
  UpdateCommentValidationSchema,
} from "@/app/constants/validation-schemas";
import { Error404, handleRequestError } from "@/utilities/error-utils";
import { isValidObjectId } from "@/utilities/helpers";
import { connect } from "@/database/connection";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    postId: string;
    commentId: string;
  };
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await connect();

    const updateData = await request.json();
    const postId = context.params.postId;
    const commentId = context.params.commentId;

    UpdateCommentValidationSchema.parse(updateData);
    IdValidationSchema.parse(postId);
    IdValidationSchema.parse(commentId);

    const { likes = 0, dislikes = 0 } = updateData;

    let updateQuery = {
      $inc: { "comments.$.likes": likes, "comments.$.dislikes": dislikes },
    };

    const query = isValidObjectId(postId) ? { _id: postId } : { id: postId };
    let details = await Post.updateOne(
      { ...query, "comments._id": commentId },
      updateQuery
    );

    if (details.matchedCount === 0)
      throw Error404(
        postId,
        `No matching post with id - ${postId} or matching comment with id - ${commentId}`
      );

    return NextResponse.json({ data: { message: "Updated" } });
  } catch (error) {
    return handleRequestError(error);
  }
}
