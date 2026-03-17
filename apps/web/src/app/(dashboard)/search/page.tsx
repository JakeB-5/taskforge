"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  EmptyState,
  Spinner,
} from "@taskforge/ui";
import { Search, FileText, FolderKanban, MessageSquare } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { search as searchApi, type SearchResult } from "@/lib/api/search";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  React.useEffect(() => {
    if (!query.trim() || query.trim().length < 2 || !activeWorkspace) {
      setResults([]);
      setTotal(0);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchApi(activeWorkspace.id, query.trim());
        setResults(data.results ?? []);
        setTotal(data.total ?? 0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeWorkspace]);

  const typeIcon = (type: string) => {
    switch (type) {
      case "task": return <FileText className="h-4 w-4" />;
      case "project": return <FolderKanban className="h-4 w-4" />;
      case "comment": return <MessageSquare className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">Search across tasks, projects, and comments.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {isLoading && <Spinner className="py-8" />}

      {!isLoading && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {total} result{total !== 1 ? "s" : ""} found
          </p>
          {results.map((result) => (
            <Card key={`${result.type}-${result.id}`} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="text-muted-foreground">
                  {typeIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{result.title}</p>
                  {result.highlight && (
                    <p className="text-xs text-muted-foreground truncate">
                      {result.highlight}
                    </p>
                  )}
                </div>
                <Badge variant="outline">{result.type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && query.length >= 2 && results.length === 0 && (
        <EmptyState
          icon={<Search className="h-6 w-6 text-muted-foreground" />}
          title="No results found"
          description={`No matches for "${query}". Try a different search term.`}
        />
      )}
    </div>
  );
}
