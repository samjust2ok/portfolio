"use client";
import useSWR from "swr";
import classNames from "classnames";
import {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { formatDate } from "../utilities/helpers";
import { Icon } from "./icon";
import { addReactionToPost, getBlogPost } from "../utilities/api";
import { ReactionButton } from "./reaction-button";
import { LikeIcon } from "./like-icon";

const getClassName = (fixed: boolean) => {
  return {
    container: fixed
      ? `page-container h-full py-2 md:py-4 gap-y-3 flex flex-col`
      : "blog-content-container",
    titleContainer: fixed ? "w-full max-w-[600px]" : "",
    title: fixed
      ? "text-xl md:text-2xl lg:text-3xl line-clamp-2 "
      : "text-3xl md:text-4xl lg:text-5xl gradient-text font-semibold !leading-tight",
    description: fixed
      ? "text-sm md:text-base line-clamp-2 lg:line-clamp-4"
      : "text-base md:text-xl",
    extraInfoContainer: fixed
      ? "ml-auto"
      : "mt-6 flex justify-between gap-3 flex-wrap",
  };
};

export function BlogHeader({
  id,
  onOpenChat,
}: {
  id: string;
  onOpenChat: () => void;
}) {
  const { data } = useSWR(["posts", id], ([_, id]) => getBlogPost(id));
  const [isAtTop, setIsAtTop] = useState(
    document.documentElement.scrollTop > 140
  );
  const [likes, setLikes] = useState(data?.likes || 0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollableHeaderRef = useRef<HTMLDivElement | null>(null);
  const fixedHeaderRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    function updateBufferMargin(atTop: boolean) {
      if (!scrollableHeaderRef.current || !fixedHeaderRef.current) return;
      const heightDiff =
        scrollableHeaderRef.current.offsetHeight -
        fixedHeaderRef.current.offsetHeight;

      document.documentElement.style.setProperty(
        "--blog-page-fixed-header-shift-diff",
        atTop ? heightDiff - 1 + "px" : "0px"
      );
    }
    new IntersectionObserver(
      ([entry]) => {
        setIsAtTop(entry.intersectionRatio < 1);
        updateBufferMargin(entry.intersectionRatio < 1);
      },
      { threshold: [1] }
    ).observe(containerRef.current!);
  }, []);

  return (
    <div ref={containerRef} className="sticky top-[-1px] z-20">
      <div
        ref={scrollableHeaderRef}
        className={isAtTop ? "opacity-0 pointer-events-none" : undefined}
      >
        <HeaderContent
          updateLikes={(likes) => setLikes(likes)}
          postId={id}
          onOpenChat={onOpenChat}
          ariaHidden={isAtTop}
          fixed={false}
          likes={likes}
        />
      </div>
      <div
        ref={fixedHeaderRef}
        className={classNames(
          "absolute top-0 w-screen opacity-0 pointer-events-none bg-primary-color",
          isAtTop && "opacity-100 pointer-events-auto"
        )}
      >
        <HeaderContent
          updateLikes={(likes) => setLikes(likes)}
          postId={id}
          onOpenChat={onOpenChat}
          ariaHidden={!isAtTop}
          fixed
          likes={likes}
        />
      </div>
    </div>
  );
}

interface HeaderContentI {
  fixed: boolean;
  postId: string;
  onOpenChat: () => void;
  ariaHidden: boolean;
  likes: number;
  updateLikes: Dispatch<SetStateAction<number>>;
}

function HeaderContent({
  fixed,
  onOpenChat,
  ariaHidden,
  postId,
  likes,
  updateLikes,
}: HeaderContentI) {
  const { data, mutate } = useSWR(["posts", postId]);
  const { data: commentsData } = useSWR(["comments", postId]);

  const comments_count = commentsData?.length || data?.comments_count || 0;

  const classes = useMemo(() => getClassName(fixed), [fixed]);
  async function updateReaction(reaction: { likes: number }) {
    await addReactionToPost(postId, reaction);
    mutate(Object.assign({}, data, { likes }));
  }

  if (!data) return null;
  const { title, estimated_read_time, description, date_created } = data;
  return (
    <div aria-hidden={ariaHidden} className="h-full">
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <h1
            className={classNames(classes.title, "gradient-text font-semibold")}
          >
            {title}
          </h1>
          <p
            className={classNames(
              classes.description,
              "font-light text-primary-text-color"
            )}
          >
            {description}
          </p>
        </div>
        <div className={classes.extraInfoContainer}>
          <div className="flex items-center space-x-1 [&>*]:min-w-[3.5rem]">
            <ReactionButton
              updateCount={updateLikes}
              updateReaction={(likes) => updateReaction({ likes })}
              count={likes}
            >
              <LikeIcon className="h-[18px] w-[18px] fill-primary-color" />
            </ReactionButton>
            <button onClick={onOpenChat} className="btn-subtle font-light">
              <Icon className="h-[18px] w-[18px] mt-0.5" icon="comment" />
              <span className="text-[13px]">{comments_count}</span>
            </button>
          </div>
          {!fixed && (
            <div className="flex items-center space-x-3 text-primary-text-color-darker font-light text-sm">
              <span>{formatDate(date_created)}</span>
              <span className="text-2xl">&middot;</span>
              <span>{estimated_read_time} mins</span>
            </div>
          )}
        </div>
      </div>
      {fixed && <div className="divider-h"></div>}
    </div>
  );
}
