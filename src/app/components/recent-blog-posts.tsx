import Link from "next/link";
import { PostInterface } from "../constants/interfaces";
import Lits, { Lit } from "./lits";
import { Post } from "./post";

export function RecentBlogPosts({ posts }: { posts: PostInterface[] }) {
  return (
    <Lits className="padded-area grid gap-2 xxs:grid-cols-1 sm:grid-cols-2 -mx-2">
      {posts.map((post) => {
        return (
          <Lit
            radius={4}
            contentClassName="recent-blog-post-content w-full h-full flex flex-col p-2"
            as={Link as any}
            className="recent-blog-post [--highlight-color:var(--border-highlight)] [--highlight-sub-color:var(--border-color)] lg:[--highlight-sub-color:transparent] lg:first:row-span-4 lg:first:self-start"
            elementProps={{
              href: `/blog/${post.id}`,
            }}
            key={post.id}
          >
            <Post post={post} />
          </Lit>
        );
      })}
    </Lits>
  );
}
