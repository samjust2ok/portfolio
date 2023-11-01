"use client";
import useSWR from "swr";

export const CommentsHeader = ({ id }: { id: string }) => {
  const { data: comments } = useSWR(["comments", id]);
  return (
    <h3 className="text-sm md:text-base font-semibold gradient-text">
      Comments {comments && `(${comments.length})`}
    </h3>
  );
};
