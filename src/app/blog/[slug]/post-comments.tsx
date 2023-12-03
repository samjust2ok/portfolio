import { unstable_serialize as serializeSWRKey } from "swr";
import { ScrollArea } from "@/components/scroll-area";
import { getBlogPostComments } from "../../api";
import { Comments } from "./comments";
import { CommentsHeader } from "./comments-header";
import { SWRProvider } from "@/swr/provider";

export async function PostComments({ id }: { id: string }) {
  const comments = await getBlogPostComments(id);
  const key = serializeSWRKey(["comments", id]);
  return (
    <SWRProvider
      value={{
        fallback: {
          [key]: comments,
        },
      }}
    >
      <ScrollArea>
        <div className="py-2 md:py-3 lg:py-5 h-full">
          <div className="h-full">
            <div className="px-3 md:px-4 lg:px-6">
              <CommentsHeader id={id} />
            </div>
            <Comments id={id} />
          </div>
        </div>
      </ScrollArea>
    </SWRProvider>
  );
}
