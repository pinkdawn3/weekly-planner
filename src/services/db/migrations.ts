import { v1 } from "./migrations/v1";

export const CURRENT_DB_VERSION = 1;

export const migrations: Record<number, () => void> = {
  1: v1,
};
