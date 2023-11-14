"use client";
import ReactDOM from "react-dom";
import useSWR, { useSWRConfig } from "swr";
import { CommentInput } from "@/components/comment-input";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CommentsList } from "@/components/comments-list";
import { Suspense } from "react";
import { getRandomNumber, randomString } from "@/app/utilities/helpers";
import { APP_USER_NAME, COLORS } from "@/app/constants/general";
import { addCommentToPost, getBlogPostComments } from "@/app/utilities/api";

export function Comments({ id }: { id: string }) {
  return (
    <UserProvider>
      <C id={id} />
    </UserProvider>
  );
}

function C({ id }: { id: string }) {
  const qKey = useRef(["comments", id]).current;
  const { user, updateUser } = useAppUser();
  const { data } = useSWR(qKey, ([_, id]) => getBlogPostComments(id));
  const { mutate } = useSWRConfig();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const comments = data || [];

  async function onSubmit() {
    if (!comment) return;
    const color = COLORS[getRandomNumber(0, COLORS.length - 1)];
    const commentObject = { color, author: user, comment };
    const commentData = {
      ...commentObject,
      _id: randomString(),
      replies: [],
      date_created: new Date().toISOString(),
      likes: 0,
    };
    try {
      ReactDOM.flushSync(() => setError(null));
      await mutate(
        qKey,
        async () => addCommentToPost(id, { author: user, comment, color }),
        {
          throwOnError: true,
          revalidate: false,
          populateCache: (comment, comments) => [comment, ...comments],
          optimisticData: (comments) => [
            { ...commentData, pending: true },
            ...comments,
          ],
        }
      );
      setError(null);
      setComment("");
    } catch (e) {
      setError("Error posting comment");
    }
  }

  return (
    <div className="mt-2 md:mt-4 lg:mt-6 overflow-hidden">
      <form action={onSubmit} className="px-3 md:px-4 lg:px-6">
        <CommentInput
          error={error}
          author={user}
          comment={comment}
          onAuthorChange={(author) => updateUser(author)}
          onCommentChange={(comment) => {
            setError(null);
            setComment(comment);
          }}
        />
      </form>
      <div className="px-4">
        <div className="divider-h my-4 lg:my-6"></div>
      </div>
      <div>
        <Suspense fallback={<p>Loading comments ....</p>}>
          <CommentsList postId={id} comments={comments} />
        </Suspense>
      </div>
    </div>
  );
}

const UserContext = createContext<{
  user: string;
  updateUser: (u: string) => void;
} | null>(null);

const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState("");
  useEffect(() => {
    setUser(localStorage[APP_USER_NAME]);
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        updateUser: (user: string) => {
          setUser(user);
          localStorage[APP_USER_NAME] = user;
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAppUser = () => useContext(UserContext)!;
