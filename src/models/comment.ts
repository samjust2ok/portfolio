import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
  {
    author: String,
    comment: String,
    date_created: Date,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    color: String,
  },
  { versionKey: false }
);

const CommentSchema = new mongoose.Schema(
  {
    author: String,
    comment: String,
    date_created: Date,
    color: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    replies: { type: [ReplySchema], default: [] },
  },
  { versionKey: false }
);

export { CommentSchema };
