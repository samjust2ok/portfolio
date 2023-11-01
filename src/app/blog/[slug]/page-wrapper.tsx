"use client";

import { BlogHeader } from "@/app/components/blog-header";
import { Drawer } from "@/app/components/drawer";
import { Header } from "@/app/components/header";
import { PropsWithChildren, ReactNode, useState } from "react";

type PageWrapperInterface = PropsWithChildren<{
  id: string;
  comments: ReactNode;
}>;

export function PageWrapper({ children, id, comments }: PageWrapperInterface) {
  const [chatOpen, setOpen] = useState(false);
  return (
    <main className="h-full">
      <section>
        <Header />
      </section>
      <section className="pt-8 md:pt-10 lg:pt-12">
        <BlogHeader onOpenChat={() => setOpen(true)} id={id} />
        {children}
      </section>
      <Drawer onClose={() => setOpen(false)} open={chatOpen}>
        {comments}
      </Drawer>
    </main>
  );
}
