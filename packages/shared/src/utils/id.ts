const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const DEFAULT_LENGTH = 21;

/**
 * Generate a nanoid-style unique ID using crypto.getRandomValues.
 */
export function generateId(length: number = DEFAULT_LENGTH): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let id = "";
  for (let i = 0; i < length; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}

/**
 * Generate a prefixed ID for specific entity types.
 */
export function generatePrefixedId(prefix: string, length: number = 16): string {
  return `${prefix}_${generateId(length)}`;
}

export const createUserId = () => generatePrefixedId("usr");
export const createWorkspaceId = () => generatePrefixedId("wks");
export const createProjectId = () => generatePrefixedId("prj");
export const createTaskId = () => generatePrefixedId("tsk");
export const createCommentId = () => generatePrefixedId("cmt");
export const createLabelId = () => generatePrefixedId("lbl");
export const createAttachmentId = () => generatePrefixedId("att");
export const createNotificationId = () => generatePrefixedId("ntf");
export const createActivityId = () => generatePrefixedId("act");
