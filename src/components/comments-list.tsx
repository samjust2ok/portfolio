"use client";

import { useSWRConfig } from "swr";
import classNames from "classnames";
import { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  Comment as CommentInterface,
  Reply,
} from "../app/constants/interfaces";
import {
  formatDate,
  getRandomNumber,
  randomString,
} from "../utilities/helpers";
import { CommentInput } from "./comment-input";
import { Icon } from "./icon";
import { COLORS } from "../app/constants/general";
import {
  addReactionToComment,
  addReactionToReply,
  addReplyToComment,
} from "@/app/api";
import { ReactionButton } from "./reaction-button";
import { LikeIcon } from "./like-icon";
import { useAppUser } from "../app/blog/[slug]/comments";

const getUpdatedComments = (
  old: CommentInterface[],
  reply: Reply,
  commentId: string
) => {
  const comments = old.slice(0);
  const index = comments.findIndex((c) => c._id === commentId);

  const commentCopy = Object.assign({}, comments[index]);
  const repliesCopy = commentCopy.replies.slice(0);
  repliesCopy.unshift(reply);

  commentCopy.replies = repliesCopy;
  comments[index] = commentCopy;

  return comments;
};

export function CommentsList({
  comments,
  postId,
}: {
  comments: CommentInterface[];
  postId: string;
}) {
  const [activeComment, setActiveComment] = useState<null | string>(null);
  return (
    <div className="flex flex-col gap-y-10">
      {comments.map((comment) => {
        return (
          <Comment
            type="comment"
            postId={postId}
            setActive={(active) =>
              setActiveComment(active ? comment._id : null)
            }
            active={comment._id === activeComment}
            key={comment._id}
            comment={comment}
          />
        );
      })}
    </div>
  );
}

function Comment({
  comment,
  active = false,
  setActive,
  postId,
  type,
  parentCommentId,
}: {
  comment: CommentInterface | Reply;
  active?: boolean;
  setActive?: (active: boolean) => void;
  postId: string;
  type: "comment" | "reply";
  parentCommentId?: string;
}) {
  const [reply, setReply] = useState("");
  const { user, updateUser } = useAppUser();
  const [error, setError] = useState<null | string>(null);
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);

  const replies = (comment as CommentInterface).replies;
  const isComment = type === "comment";

  const { mutate } = useSWRConfig();

  const initials = useMemo(
    () =>
      comment.author
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join(""),
    [comment.author]
  );

  async function onReply() {
    if (!reply) return;

    const color = COLORS[getRandomNumber(0, COLORS.length - 1)];
    const replyObject = { color, author: user, comment: reply };
    const replyId = randomString();
    const replyData = {
      ...replyObject,
      _id: replyId,
      date_created: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    try {
      ReactDOM.flushSync(() => setError(null));
      await mutate(
        ["comments", postId],
        async () => addReplyToComment(postId, comment._id, replyObject),
        {
          throwOnError: true,
          revalidate: false,
          populateCache: (reply, comments) =>
            getUpdatedComments(comments, reply, comment._id),
          optimisticData: (comments) =>
            getUpdatedComments(
              comments,
              { pending: true, ...replyData },
              comment._id
            ),
        }
      );
      setReply("");
      setError(null);
    } catch (e) {
      setError("Error posting reply");
    }
  }

  async function onReact(props: { likes?: number; dislikes?: number }) {
    const mutateFn =
      type === "comment" ? addReactionToComment : addReactionToReply;
    return mutateFn(
      {
        postId,
        commentId: parentCommentId || comment._id,
        replyId: comment._id,
      },
      props
    );
  }

  return (
    <div
      className={classNames("flex flex-col px-3 md:px-4 lg:px-6", {
        "opacity-25 pointer-events-none": comment.pending,
        "scale-90 origin-left gap-y-1": !replies,
        "gap-y-3": replies,
      })}
    >
      <div className="flex gap-2 items-center">
        <div
          style={{ backgroundColor: comment.color }}
          className={classNames(
            "h-5 w-5 lg:h-6 lg:w-6 rounded-full flex items-center justify-center text-[10px] lg:text-[13px] text-white uppercase"
          )}
        >
          {initials}
        </div>
        <div className="flex items-center text-primary-text-color-darker">
          <p className="text-sm md:text-base">{comment.author}</p>
          <span className="mx-2 text-2xl">&middot;</span>
          <p className="text-sm font-light md:text-base">
            {formatDate(comment.date_created)}
          </p>
        </div>
      </div>
      <p className="font-light text-primary-text-color text-sm md:text-base">
        {comment.comment}
      </p>
      <div className="flex gap-x-2 [&>*]:min-w-[2.5rem]">
        <ReactionButton
          updateCount={setLikes}
          updateReaction={(likes) => onReact({ likes })}
          count={likes}
        >
          <LikeIcon className="h-4 w-4 mb-0.5 fill-primary-color" />
        </ReactionButton>
        <ReactionButton
          updateCount={setDislikes}
          updateReaction={(dislikes) => onReact({ dislikes })}
          count={dislikes}
        >
          <Icon className="h-4 w-4 -mb-1" icon="thumbs-down" />
        </ReactionButton>
        {isComment && (
          <button className="btn-subtle" onClick={() => setActive?.(!active)}>
            <Icon className="h-4 w-4 mt-1" icon="comment" />
            <span className="text-[13px]">{replies.length}</span>
          </button>
        )}
      </div>
      {active && isComment && (
        <div className="ml-2 border-l border-border-color px-3">
          <form action={onReply}>
            <CommentInput
              replyField
              error={error}
              onAuthorChange={(author) => updateUser(author)}
              onCommentChange={(reply) => setReply(reply)}
              author={user}
              comment={reply}
            />
          </form>
          {isComment && replies.length ? (
            <div className="mt-4 flex flex-col gap-y-2 -mx-3 md:-mx-4 lg:-mx-6">
              {replies.map((reply) => (
                <Comment
                  parentCommentId={comment._id}
                  type="reply"
                  postId={postId}
                  key={reply._id}
                  comment={reply}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
