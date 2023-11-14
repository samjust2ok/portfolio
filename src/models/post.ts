import mongoose from "mongoose";
import { CommentSchema } from "./comment";

const schema = new mongoose.Schema(
  {
    id: String,
    title: String,
    description: String,
    cover_image: String,
    content: String,
    estimated_read_time: Number,
    date_created: Date,
    likes: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
  },
  { versionKey: false }
);

const Post = mongoose.models?.Post || mongoose.model("Post", schema);

export default Post;
