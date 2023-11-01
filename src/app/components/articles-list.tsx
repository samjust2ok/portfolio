import { PostInterface } from "../constants/interfaces";
import { Article } from "./article";

export function ArticlesList({ articles }: { articles: PostInterface[] }) {
  return (
    <div className="w-full mx-auto max-w-xl lg:max-w-4xl grid xxs:grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
      {articles.map((article) => (
        <Article key={article.title} article={article} />
      ))}
    </div>
  );
}
