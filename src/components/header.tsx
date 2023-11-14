"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "classnames";

export function Header() {
  const pathname = usePathname();

  const isBlog = pathname.includes("blog");
  const hasLogoExtenstion = isBlog;

  return (
    <header className="flex flex-col h-20">
      <div className="page-container flex-grow flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link
            href="/"
            className={classNames(
              "text-primary-text-color-darker hover:text-primary-text-hover-color leading-5",
              {
                "text-xl md:text-2xl": hasLogoExtenstion,
                "text-2xl md:text-3xl": !hasLogoExtenstion,
              }
            )}
          >
            fe.uel
          </Link>
          {isBlog && (
            <>
              <div className="divider-v h-6 md:h-8 bg-logo-color"></div>
              <Link
                href="/blog"
                className="text-xl text-primary-text-color-darker hover:text-primary-text-hover-color leading-5"
              >
                BLOG
              </Link>
            </>
          )}
        </div>
        <nav className="flex items-center space-x-2 md:space-x-4 text-primary-text-color">
          {!isBlog && (
            <>
              <Link className="primary-link" href="/blog">
                Blog
              </Link>
              <span>/</span>
            </>
          )}
          <a
            className="primary-link"
            target="_blank"
            href="https://www.linkedin.com/in/safelix/"
          >
            LinkedIn
          </a>
          <span>/</span>
          <a
            className="primary-link"
            target="_blank"
            href="https://github.com/samjust2ok"
          >
            Github
          </a>
        </nav>
      </div>
      <div className="divider-h"></div>
    </header>
  );
}
