import {
  IdValidationSchema,
  UpdatePostValidationSchema,
} from "@/app/constants/validation-schemas";
import { Error404, handleRequestError } from "@/utilities/error-utils";
import { isValidObjectId } from "@/utilities/helpers";
import { connect } from "@/database/connection";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    postId: string;
  };
};

export async function GET(request: Request, context: Context) {
  try {
    await connect();

    const postId = context.params.postId;

    IdValidationSchema.parse(postId);

    const query = isValidObjectId(postId) ? { _id: postId } : { id: postId };
    const post = await Post.aggregate([
      { $match: query },
      { $addFields: { comments_count: { $size: "$comments" } } },
      { $project: { comments: 0 } },
    ]);
    if (!post) throw Error404(postId);

    return NextResponse.json({ data: post[0] });
  } catch (error) {
    return handleRequestError(error);
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await connect();

    const postId = context.params.postId;
    const postData = await request.json();

    UpdatePostValidationSchema.parse(postData);
    IdValidationSchema.parse(postId);

    const { tags, likes, ...otherFields } = postData;

    const query = isValidObjectId(postId) ? { _id: postId } : { id: postId };
    const details = await Post.updateOne(
      query,
      Object.assign(
        { $set: otherFields },
        tags && { $addToSet: { tags } },
        likes && { $inc: { likes } }
      )
    );

    if (details.matchedCount == 0) throw Error404(postId);

    return NextResponse.json({ data: { message: "Updated" } });
  } catch (error) {
    return handleRequestError(error);
  }
}
