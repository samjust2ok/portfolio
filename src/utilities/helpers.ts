import { AVERAGE_WORDS_PER_MINUTE } from "../app/constants/general";
import { ZodError } from "zod";

export function formatDate(date: Date | string) {
  if (typeof date == "string") date = new Date(date);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}

export function throttle(cb: Function, ms: number) {
  let id: any;
  return () => {
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      cb();
      id = null;
    }, ms);
  };
}

type AnyFunction = (...args: any[]) => void;
export function debounce<T extends AnyFunction>(func: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T;
}
// This function takes the generated markup and splits the string into
// an array of html strings, the separation is needed to distinguish stuff like
// code-blocks and sandboxes from other general markups

const MATCH_SANDBOX_AND_CODE_BLOCK_REGEX =
  /<pre data-type=['"](?:sandbox|code-block)['"][^>]*>[\s\S]*?<\/pre>/g;

export function generateSplit(content: string) {
  const REPLACER = `<<<<>>>>replacer<<<<>>>>`;
  const matches = content.match(MATCH_SANDBOX_AND_CODE_BLOCK_REGEX);

  if (!matches) return [content];

  const replaced = content.replace(
    MATCH_SANDBOX_AND_CODE_BLOCK_REGEX,
    REPLACER
  );
  const splits = [];

  let index = replaced.indexOf(REPLACER),
    matchIndex = 0,
    start = 0;

  while (true) {
    splits.push(replaced.slice(start, index), matches[matchIndex]);

    matchIndex++;
    start = index + REPLACER.length;
    index = replaced.indexOf(REPLACER, index + REPLACER.length);

    if (index === -1) {
      const rem = replaced.slice(start);
      if (rem) splits.push(replaced.slice(start));
      break;
    }
  }

  return splits;
}

export function getAttributeValue(htmlString: string, attr: string) {
  const regex = new RegExp(`${attr}="([^"]*)"`);
  const match = htmlString.match(regex);
  if (match) return match[1];
  return null;
}

export function getHTMLPreElementContent(htmlString: string) {
  const regex = /<pre[^>]*>(.*?)<\/pre>/;
  const match = htmlString.match(regex);
  if (match) return match[1];
  return "";
}

export function removeHtmlTags(input: string) {
  return input
    .replace(/<[^>]*>/g, " ")
    .split(" ")
    .filter((x) => x)
    .join(" ");
}

export function estimateReadingTime(
  articleContent: string,
  wordsPerMinute = AVERAGE_WORDS_PER_MINUTE
) {
  // Remove all codeblocks, sandbox, and image elements
  const splits = generateSplit(articleContent);

  function getWordsCount(s: string) {
    return s.split(/\s+/).length;
  }

  let totalWordCount = splits.reduce((total, s) => {
    const dataType = getAttributeValue(s, "data-type");

    if (dataType === "sandbox") {
      const files = JSON.parse(getHTMLPreElementContent(s)).files as Record<
        string,
        { code: string }
      >;
      total += Object.values(files).reduce((a: number, f) => {
        a += getWordsCount(f.code);
        return a;
      }, 0);
    } else {
      total += getWordsCount(removeHtmlTags(s));
    }

    return total;
  }, 0);

  // Calculate the estimated reading time in minutes
  const readingTimeMinutes = Math.ceil(totalWordCount / wordsPerMinute);

  return readingTimeMinutes;
}

export function getErrorListFromZodErrorObject(error: ZodError) {
  return error.issues.map((issue) => {
    const i = issue as any;
    if (i.expected && i.received && i.path[0])
      return `Expected ${i.expected}, Got ${i.received} for ${issue.path[0]}`;
    return i.message;
  });
}

export function convertToSlug(s: string) {
  return s
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove special characters (excluding hyphen, underscore, and whitespace)
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

export function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function randomString() {
  return (Math.random() + 1).toString(36).substring(7);
}
