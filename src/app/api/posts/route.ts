import { PostValidationSchema } from "@/app/constants/validation-schemas";
import { handleRequestError } from "@/app/utilities/error-utils";
import { connect } from "@/database/connection";
import Post from "@/models/post";
import { NextResponse, NextRequest } from "next/server";
import { convertToSlug, estimateReadingTime } from "../../utilities/helpers";

export async function GET() {
  try {
    await connect();
    const posts = await Post.aggregate([
      { $match: {} },
      { $addFields: { comments_count: { $size: "$comments" } } },
      { $project: { comments: 0, content: 0 } },
      { $sort: { date_created: -1 } },
    ]);
    return NextResponse.json({ data: posts });
  } catch (error) {
    return handleRequestError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();

    const postData = await request.json();

    PostValidationSchema.parse(postData);

    const newPost = new Post({
      ...postData,
      id: convertToSlug(postData.title),
      estimated_read_time: estimateReadingTime(postData.content),
      date_created: new Date().toISOString(),
    });

    const savedPost = await newPost.save();
    return NextResponse.json({ data: savedPost });
  } catch (error) {
    return handleRequestError(error);
  }
}
