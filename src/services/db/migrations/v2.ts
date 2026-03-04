import db from "../database.service";

export const v2 = () => {
  db.execSync("ALTER TABLE recipes ADD COLUMN photo_uri TEXT;");
};
