import {
  IdValidationSchema,
  UpdateCommentValidationSchema,
} from "@/app/constants/validation-schemas";
import { Error404, handleRequestError } from "@/app/utilities/error-utils";
import { isValidObjectId } from "@/app/utilities/helpers";
import { connect } from "@/database/connection";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    postId: string;
    commentId: string;
    replyId: string;
  };
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await connect();

    const updateData = await request.json();
    const postId = context.params.postId;
    const commentId = context.params.commentId;
    const replyId = context.params.replyId;

    UpdateCommentValidationSchema.parse(updateData);
    IdValidationSchema.parse(postId);
    IdValidationSchema.parse(commentId);
    IdValidationSchema.parse(replyId);

    const { likes = 0, dislikes = 0 } = updateData;

    const query = isValidObjectId(postId) ? { _id: postId } : { id: postId };
    let details = await Post.updateOne(
      { ...query, "comments._id": commentId },
      {
        $inc: {
          "comments.$.replies.$[reply].likes": likes,
          "comments.$.replies.$[reply].dislikes": dislikes,
        },
      },
      { arrayFilters: [{ "reply._id": replyId }] }
    );

    if (details.matchedCount === 0)
      throw Error404(
        postId,
        `No matching post with id - ${postId}, or matching comment with id - ${commentId}, or matching reply with id - ${replyId}`
      );

    return NextResponse.json({
      data: {
        message: "Updated reply - " + replyId,
      },
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
