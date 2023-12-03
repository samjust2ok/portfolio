import { unstable_serialize as serializeSWRKey } from "swr";
import BlogPostRenderer from "@/components/blog-post-renderer";
import { Tag } from "@/components/tag";
import { getBlogPost, getBlogPosts } from "../../api";
import Image from "next/image";
import Link from "next/link";
import { PageWrapper } from "./page-wrapper";
import { PostComments } from "./post-comments";
import { SWRProvider } from "@/swr/provider";

interface PageI {
  params: { slug: string };
}

export default async function Page({ params }: PageI) {
  const id = decodeURIComponent(params.slug);
  const post = await getBlogPost(id);
  const key = serializeSWRKey(["posts", id]);

  return (
    <SWRProvider value={{ fallback: { [key]: post } }}>
      <PageWrapper comments={<PostComments id={id} />} id={id}>
        <div className="blog-content blog-content-container">
          <div className="rounded-sm overflow-hidden h-[300px] md:h-[450px] bg-secondary-color">
            <Image
              height={500}
              width={500}
              className="object-cover h-full w-full"
              src={post.cover_image}
              alt=""
            />
          </div>
          <div>
            <div className="text-base md:text-xl text-primary-text-color font-light font-source-serif">
              <BlogPostRenderer content={post.content} />
            </div>
            <div className="py-10">
              <div className="flex space-x-3">
                {post.tags.map((tag) => (
                  <Tag
                    component={Link}
                    href={`/tags/${tag.toLowerCase()}`}
                    variant="large"
                    className="hover:bg-secondary-color"
                    key={tag}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </SWRProvider>
  );
}
