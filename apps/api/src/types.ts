import type { DatabaseClient } from "@taskforge/database";

export type Env = {
  Variables: {
    db: DatabaseClient;
    userId: string;
    userEmail: string;
    userRole: string;
  };
};
