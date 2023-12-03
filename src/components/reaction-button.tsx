import { Dispatch, ReactNode, SetStateAction, useRef } from "react";
import { debounce } from "@/utilities/helpers";

interface ReactionButtonI {
  count: number;
  updateReaction: (count: number) => Promise<any>;
  updateCount: Dispatch<SetStateAction<number>>;
  children: ReactNode;
}

export function ReactionButton({
  count,
  updateCount,
  updateReaction,
  children,
}: ReactionButtonI) {
  const addedCountRef = useRef(0);

  async function submitReaction() {
    const newReactionCount = addedCountRef.current;
    addedCountRef.current = 0;
    try {
      await updateReaction(newReactionCount);
    } catch (e) {
      updateCount((count) => count - newReactionCount);
    }
  }

  const debouncedSubmitReaction = useRef(
    debounce(submitReaction, 1500)
  ).current;

  const onReact = () => {
    updateCount(count + 1);
    addedCountRef.current += 1;
    debouncedSubmitReaction();
  };

  return (
    <button onClick={onReact} className="btn-subtle">
      {children}
      <span className="text-[13px]">{count}</span>
    </button>
  );
}
