"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Children, isValidElement } from "react";

export type TabProps<T extends string> = {
  title: T;
  path: string;
  children: React.ReactNode;
};

type ToggleProps = {
  children: React.ReactNode;
};

export function Tab<T extends string>({ children }: TabProps<T>) {
  return <>{children}</>;
}

export default function Toggle({ children }: ToggleProps) {
  const searchParams = useSearchParams();

  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps<string>> =>
      isValidElement<TabProps<string>>(child),
  );

  const tab = searchParams.get("tab");

  const activeTab =
    tabs.find(
      (child) => child.props.title.toLowerCase() === (tab ?? "").toLowerCase(),
    ) ?? tabs[0];

  return (
    <>
      <nav className="inline-flex rounded-lg bg-gray-100 p-1 mb-5">
        {tabs.map((child) => {
          const { title, path } = child.props;
          const active = child === activeTab;

          return (
            <Link
              key={title}
              href={path}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {title}
            </Link>
          );
        })}
      </nav>

      <section>{activeTab?.props.children}</section>
    </>
  );
}
