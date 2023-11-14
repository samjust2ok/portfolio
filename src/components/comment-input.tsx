"use client";

import { Icon } from "./icon";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import classNames from "classnames";

interface CommentInputI {
  onAuthorChange: (v: string) => void;
  onCommentChange: (v: string) => void;
  comment: string;
  author: string;
  replyField?: boolean;
  error?: string | null;
}
export function CommentInput({
  onAuthorChange,
  onCommentChange,
  author,
  comment,
  replyField = false,
  error = null,
}: CommentInputI) {
  return (
    <div>
      <div
        className={classNames(
          "flex flex-col space-y-3 rounded-md border py-2",
          error ? "border-red-700" : "border-border-color"
        )}
      >
        <div className="flex flex-nowrap items-center space-x-1 text-sm text-primary-text-color-darker px-4">
          <span className="whitespace-nowrap">
            {replyField ? "replying as" : "commenting as"}{" "}
          </span>
          <span className="relative text-primary-text-hover-color ml-1">
            <input
              onChange={(e) => onAuthorChange(e.target.value)}
              value={author}
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              name="author"
              placeholder="Anonymous"
              className="Comment-input-author bg-transparent placeholder:text-opacity-30 placeholder:text-primary-text-hover-color focus:outline-none text-sm font-medium"
              type="text"
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer pointer-events-none">
              <Icon className="h-3 w-3" icon="pencil" />
            </span>
          </span>
        </div>
        <div data-replicated-value={comment} className="Auto-grow-text-area">
          <textarea
            onChange={(e) => onCommentChange(e.target.value)}
            value={comment}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            className={replyField ? "" : "min-h-[5rem]"}
            placeholder="Thoughts please?"
            name="comment"
          ></textarea>
        </div>
        <div className="flex justify-end px-4">
          <SubmitButton
            label={replyField ? "Reply" : "Comment"}
            disabled={!comment}
          />
        </div>
      </div>
      {error && (
        <div className="text-red-700 text-[12px] h-[13px]">{error}</div>
      )}
    </div>
  );
}

function SubmitButton({
  disabled,
  label,
}: {
  disabled: boolean;
  label: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending || disabled}
      className="rounded-full bg-accent-color text-white opacity-80 text-xs px-2 py-1.5 disabled:bg-gray-300 disabled:bg-opacity-20 disabled:text-opacity-40 active:scale-95 duration-100"
    >
      {label}
    </button>
  );
}
