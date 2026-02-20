"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface TagFilterProps {
  tags: string[];
  currentTag?: string;
}

export const TagFilter = ({ tags, currentTag }: TagFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (currentTag === tag) {
      // If clicking the active tag, remove the filter
      params.delete("tag");
      params.delete("page"); // Reset to page 1
    } else {
      // Set the new tag filter
      params.set("tag", tag);
      params.delete("page"); // Reset to page 1 when changing filters
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("tag");
    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-body-sm text-text-soft font-semibold uppercase tracking-wider">Filter by:</span>
        
        <Button
          variant={!currentTag ? "primary" : "secondary"}
          size="sm"
          onClick={handleClearFilter}
          className="rounded-full transition-transform duration-200 hover:scale-105"
        >
          All
        </Button>

        {tags.map((tag) => (
          <Button
            key={tag}
            variant={currentTag === tag ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleTagClick(tag)}
            className="rounded-full capitalize transition-transform duration-200 hover:scale-105"
          >
            {tag}
          </Button>
        ))}
      </div>

      {currentTag && (
        <div className="mt-4 text-body-sm text-text-muted animate-in fade-in slide-in-from-top-2 duration-300">
          Showing posts tagged with <span className="font-semibold text-text-primary">{currentTag}</span>
          {" · "}
          <button
            onClick={handleClearFilter}
            className="text-accent-primary hover:text-accent-strong underline underline-offset-2 decoration-accent-primary/30 hover:decoration-accent-primary font-medium transition-all duration-200"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
};
