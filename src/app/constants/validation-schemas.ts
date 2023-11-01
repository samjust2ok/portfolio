import zod from "zod";

export const PostValidationSchema = zod
  .object({
    title: zod.string(),
    description: zod.string(),
    content: zod.string(),
    cover_image: zod.string(),
    tags: zod.array(zod.string()).optional(),
  })
  .strip();

export const UpdatePostValidationSchema = PostValidationSchema.extend({
  likes: zod.number(),
}).partial();

export const CommentValidationSchema = zod
  .object({
    author: zod.string(),
    comment: zod.string(),
    color: zod.string(),
  })
  .strip();

export const UpdateCommentValidationSchema = zod
  .object({
    likes: zod.number(),
    dislikes: zod.number(),
  })
  .partial();

export const IdValidationSchema = zod.string();
