import { Metadata, ResolvingMetadata } from "next";
import { AllBlogPosts } from "../components/all-blog-posts";
import { Header } from "../components/header";
import { RecentBlogPosts } from "../components/recent-blog-posts";
import { getBlogPosts } from "../utilities/api";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const article = { title: "New Post" };

  return {
    title: "Blog | " + article.title,
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
}

export default async function Page() {
  const posts = await getBlogPosts();
  return (
    <main className="h-screen">
      <section>
        <Header />
      </section>
      <section className="page-container">
        <div className="py-8 md:py-10 lg:py-16 space-y-1 md:space-y-2 lg:space-y-3">
          <h1 className="gradient-text text-center xxs:text-xl sm:text-3xl md:text-4xl lg:text-5xl">
            Bits & Beyond: <span>Tales of Tech and Creativity</span>
          </h1>
          <p className="text-center text-primary-text-color font-light text-xs sm:text-base">
            My Musings, Insights from my everyday experience
          </p>
        </div>
      </section>
      <section className="page-container-padded">
        <h2 className="padded-area text-primary-text-color text-xs md:text-sm uppercase tracking-wider">
          Recent Posts
        </h2>
        <div className="py-4">
          <RecentBlogPosts posts={posts.slice(0, 4)} />
        </div>
      </section>
      <section className="page-container-padded">
        <div className="divider-h my-16"></div>
      </section>
      <section className="page-container-padded mt-6">
        <h2 className="padded-area text-primary-text-color text-xs md:text-sm uppercase tracking-wider">
          All posts
        </h2>
        <div className="py-4">
          <AllBlogPosts posts={posts.reverse()} />
        </div>
      </section>
    </main>
  );
}
