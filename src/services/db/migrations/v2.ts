import db from "../client";

export const v2 = () => {
  db.execSync(`ALTER TABLE menus ADD COLUMN structure TEXT`);
};
