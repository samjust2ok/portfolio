export interface Comment {
  _id: string;
  comment: string;
  author: string;
  date_created: string;
  likes: number;
  dislikes: number;
  color?: string;
  replies: Omit<Comment, "replies">[];
  pending?: boolean | undefined;
}

export type Reply = Comment["replies"][number];

export interface CreatePostInterface {
  title: string;
  description: string;
  cover_image: string;
  tags: string[];
  content: string;
}

export interface PostInterface extends CreatePostInterface {
  _id: string;
  id: string;
  likes: number;
  date_created: Date;
  estimated_read_time: string;
  comments_count: number;
}

export interface CreateCommentInterface {
  comment: string;
  author: string;
  color: string;
}
