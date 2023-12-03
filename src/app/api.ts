import { connect } from "@/database/connection";
import { BASE_API_URL } from "../app/constants/general";
import {
  Comment,
  CreateCommentInterface,
  PostInterface,
} from "../app/constants/interfaces";
import Post from "@/models/post";
import { IdValidationSchema } from "../app/constants/validation-schemas";
import { isValidObjectId } from "@/utilities/helpers";
import { Error404 } from "@/utilities/error-utils";

class HttpError extends Error {
  message: string;
  status: number;
  errors: string[];
  constructor(message: string, status: number, errors: string[]) {
    super();
    this.message = message;
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  url: string,
  opts: RequestInit | undefined = {}
): Promise<T> {
  if (!opts?.next) opts.next = {};
  opts.next.revalidate = 0;
  try {
    const response = await fetch(BASE_API_URL + url, opts);
    let r = await response.json();
    if (!response.ok) throw r;
    return r.data as unknown as T;
  } catch (e) {
    const error = e as any;
    throw new HttpError(error.message, error.status, error.errors);
  }
}

export async function getBlogPosts(): Promise<PostInterface[]> {
  try {
    await connect();
    const posts = await Post.aggregate([
      { $match: {} },
      { $addFields: { comments_count: { $size: "$comments" } } },
      { $project: { comments: 0, content: 0 } },
      { $sort: { date_created: -1 } },
    ]);
    return posts;
  } catch (e) {
    console.log("ERROR SOURCE 1", e);
    throw e;
  }
}

export async function getBlogPost(id: string): Promise<PostInterface> {
  try {
    await connect();
    IdValidationSchema.parse(id);

    const query = isValidObjectId(id) ? { _id: id } : { id };
    const post = await Post.aggregate([
      { $match: query },
      { $addFields: { comments_count: { $size: "$comments" } } },
      { $project: { comments: 0 } },
    ]);
    if (!post) throw Error404(id);

    return JSON.parse(JSON.stringify(post[0]));
  } catch (error) {
    console.log("ERROR SOURCE 2", error);
    throw error;
  }
}

export async function getBlogPostComments(id: string): Promise<Array<Comment>> {
  const comments = await request<Array<Comment>>(`/posts/${id}/comments`);
  return comments;
}

export async function addCommentToPost(
  id: string,
  post: CreateCommentInterface
): Promise<Array<Comment>> {
  const comments = await request<Array<Comment>>(`/posts/${id}/comments`, {
    body: JSON.stringify(post),
    method: "POST",
  });
  return comments;
}

export async function addReplyToComment(
  postId: string,
  commentId: string,
  reply: CreateCommentInterface
): Promise<Comment> {
  const replyData = await request<Comment>(
    `/posts/${postId}/comments/${commentId}/replies`,
    {
      body: JSON.stringify(reply),
      method: "POST",
    }
  );
  return replyData;
}

export async function addReactionToPost(
  postId: string,
  reaction: { likes: number }
) {
  await request<Comment>(`/posts/${postId}`, {
    body: JSON.stringify(reaction),
    method: "PATCH",
  });
}

type ReactionRequestProp = {
  postId: string;
  commentId: string;
  replyId?: string;
};

export async function addReactionToComment(
  { postId, commentId }: ReactionRequestProp,
  reaction: { likes?: number; dislikes?: number }
) {
  await request<Comment>(`/posts/${postId}/comments/${commentId}`, {
    body: JSON.stringify(reaction),
    method: "PATCH",
  });
}

export async function addReactionToReply(
  { postId, commentId, replyId }: ReactionRequestProp,
  reaction: { likes?: number; dislikes?: number }
) {
  await request<Comment>(
    `/posts/${postId}/comments/${commentId}/replies/${replyId}`,
    {
      body: JSON.stringify(reaction),
      method: "PATCH",
    }
  );
}
