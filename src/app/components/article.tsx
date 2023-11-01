import Link from "next/link";
import { PostInterface } from "../constants/interfaces";
import { Lit } from "./lits";
import { Tag } from "./tag";

export function Article({ article }: { article: PostInterface }) {
  return (
    <Lit
      as={Link as any}
      className="home-page-post-card [--highlight-color:var(--border-highlight)] [--highlight-sub-color:var(--border-color)]"
      elementProps={{
        href: `/blog/${article.id}`,
      }}
      contentClassName="w-full h-full flex flex-col pt-[8rem] md:pt-[10rem] gap-y-5 rounded-sm p-3"
    >
      <div></div>
      <h3 className="gradient-text line-clamp-2">{article.title}</h3>
      <div className="flex-grow flex flex-col justify-between">
        <p className="text-primary-text-color-darker text-sm font-light line-clamp-3">
          {article.description}
        </p>
        {article.tags.length ? (
          <div className="flex flex-wrap gap-1 mt-8">
            {article.tags.slice(0, 4).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}
      </div>
    </Lit>
  );
}
