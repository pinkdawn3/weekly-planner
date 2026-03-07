import { v1 } from "./migrations/v1";
import { v2 } from "./migrations/v2";

export const CURRENT_DB_VERSION = 2;

export const migrations: Record<number, () => void> = {
  1: v1,
  2: v2,
};
