import { Metadata } from "next";
import Image from "next/image";
import { ArticlesList } from "@/components/articles-list";
import { AutoScrollText } from "@/components/auto-scroll-text";
import { Bubbles } from "@/components/bubbles";
import { Header } from "@/components/header";
import Slide from "@/components/slider";
import { getBlogPosts } from "./api";

export const metadata: Metadata = {
  title: "Felix Samuel",
};

const skillSlideImages = [
  "tools/1.svg",
  "tools/2.svg",
  "tools/3.svg",
  "tools/4.svg",
  "tools/5.svg",
  "tools/6.svg",
  "tools/7.svg",
  "tools/8.svg",
  "tools/9.svg",
];

export default async function Page() {
  const articles = await getBlogPosts();
  return (
    <main className="h-full">
      <header className="relative">
        <section className="absolute inset-0 -z-10">
          <div className=" h-full w-full z-0">
            <Bubbles />
          </div>
        </section>
        <section>
          <Header />
        </section>
        <section className="page-container">
          <div className="py-16 md:py-20 lg:py-24">
            <div className="flex flex-col space-y-4 items-center justify-center mx-auto max-w-3xl">
              <Image
                width={300}
                height={300}
                className="h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 object-cover"
                alt="A picture of me wearning my cool Barner brand glasses"
                src="/profile.png"
              />
              <p className="text-primary-text-color text-sm">
                Hola, I&apos;m Felix Samuel
              </p>
              <h2 className="!leading-9 md:!leading-[2.7rem] lg:!leading-[4rem] text-3xl md:text-4xl lg:text-5.5xl text-center gradient-text">
                Building{" "}
                <AutoScrollText
                  className="text-accent-color"
                  texts={["scalable", "efficient", "durable"]}
                />{" "}
                <br /> applications that runs on the <br /> web.
              </h2>
              {/* <button className="btn btn-lg btn-fancy mt-4 md:!mt-8 lg:!mt-12 text-sm">
                <Icon icon="email" />
                <span>Reach Out</span>
              </button> */}
            </div>
          </div>
        </section>
      </header>
      <section className="container mx-auto max-w-full">
        <div className="relative h-44 bg-secondary-color border-t border-b border-border-color flex items-center">
          <div className="flex-grow">
            <Slide slides={skillSlideImages} />
          </div>
        </div>
      </section>
      <section className="page-container">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="flex flex-col space-y-10 items-center justify-center">
            <h2 className="gradient-text text-2xl">Articles & Blog Posts</h2>
            <div className="w-full">
              <ArticlesList articles={articles} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
