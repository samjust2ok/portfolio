import Image from "next/image";
import { PostInterface } from "../app/constants/interfaces";
import { formatDate } from "../app/utilities/helpers";
import { Tag } from "./tag";

export function Post({ post }: { post: PostInterface }) {
  return (
    <div className="post-content h-full">
      <div className="rounded overflow-hidden flex-shrink-0 bg-primary-color">
        <Image
          height={500}
          width={500}
          className="object-cover h-full w-full bg-secondary-color"
          src={post.cover_image}
          alt=""
        />
      </div>
      <div className="h-full flex-grow flex flex-col w-full">
        <div className="flex flex-col space-y-4">
          <div className="post-duration flex space-x-2 text-primary-text-color-darker text-xs">
            <span>{formatDate(post.date_created)}</span>
            <span>&middot;</span>
            <span>{post.estimated_read_time} mins</span>
          </div>
          <p className="post-title gradient-text text-lg line-clamp-2">
            {post.title}
          </p>
          <p className="post-description text-primary-text-color-darker font-light text-sm line-clamp-3">
            {post.description}
          </p>
        </div>
        {post.tags.length ? (
          <div className="flex overflow-x-auto flex-nowrap gap-1 mt-6">
            {post.tags.slice(0, 4).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
