"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@taskforge/ui";
import { FileText, FolderKanban, MessageSquare, Search } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { search as searchApi, type SearchResult } from "@/lib/api/search";

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const router = useRouter();
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  // Cmd+K shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!query.trim() || query.trim().length < 2 || !activeWorkspace) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchApi(activeWorkspace.id, query.trim());
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeWorkspace]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");

    switch (result.type) {
      case "task":
        if (result.projectId) {
          router.push(`/projects/${result.projectId}?task=${result.id}`);
        }
        break;
      case "project":
        router.push(`/projects/${result.id}`);
        break;
      case "comment":
        if (result.projectId) {
          router.push(`/projects/${result.projectId}`);
        }
        break;
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "task":
        return <FileText className="mr-2 h-4 w-4 text-muted-foreground" />;
      case "project":
        return <FolderKanban className="mr-2 h-4 w-4 text-muted-foreground" />;
      case "comment":
        return <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />;
      default:
        return <Search className="mr-2 h-4 w-4 text-muted-foreground" />;
    }
  };

  const taskResults = results.filter((r) => r.type === "task");
  const projectResults = results.filter((r) => r.type === "project");
  const commentResults = results.filter((r) => r.type === "comment");

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search tasks, projects, comments..."
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
      />
      <CommandList>
        {isSearching && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Searching...
          </div>
        )}
        {!isSearching && query.length >= 2 && results.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {!isSearching && query.length < 2 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Type at least 2 characters to search...
          </div>
        )}
        {taskResults.length > 0 && (
          <CommandGroup heading="Tasks">
            {taskResults.map((result) => (
              <CommandItem
                key={`task-${result.id}`}
                onSelect={() => handleSelect(result)}
              >
                {typeIcon(result.type)}
                <span>{result.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {projectResults.length > 0 && (
          <>
            {taskResults.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Projects">
              {projectResults.map((result) => (
                <CommandItem
                  key={`project-${result.id}`}
                  onSelect={() => handleSelect(result)}
                >
                  {typeIcon(result.type)}
                  <span>{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        {commentResults.length > 0 && (
          <>
            {(taskResults.length > 0 || projectResults.length > 0) && (
              <CommandSeparator />
            )}
            <CommandGroup heading="Comments">
              {commentResults.map((result) => (
                <CommandItem
                  key={`comment-${result.id}`}
                  onSelect={() => handleSelect(result)}
                >
                  {typeIcon(result.type)}
                  <span className="truncate">{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
