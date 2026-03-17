// Pagination
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 1;

// Rate limiting (requests per window)
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 100;
export const RATE_LIMIT_AUTH_MAX_REQUESTS = 10; // stricter for auth endpoints

// File uploads
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_ATTACHMENTS_PER_TASK = 20;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
  "application/zip",
] as const;

// Content limits
export const MAX_TASK_TITLE_LENGTH = 500;
export const MAX_TASK_DESCRIPTION_LENGTH = 10000;
export const MAX_COMMENT_LENGTH = 10000;
export const MAX_PROJECT_NAME_LENGTH = 100;
export const MAX_WORKSPACE_NAME_LENGTH = 50;
export const MAX_LABEL_NAME_LENGTH = 50;
export const MAX_USER_NAME_LENGTH = 100;
export const MAX_BIO_LENGTH = 500;

// Entity limits
export const MAX_LABELS_PER_TASK = 10;
export const MAX_SUBTASKS_PER_TASK = 50;
export const MAX_PROJECTS_PER_WORKSPACE = 100;
export const MAX_MEMBERS_PER_WORKSPACE = 500;
