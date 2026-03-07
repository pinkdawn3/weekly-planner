import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import {
  getAllMealTypes,
  getAllLabels,
  getAllRecipes,
  createMealType,
  createLabel,
  createRecipe,
} from "./db/database.service";
import { ExportData } from "../types/exportData";

export const exportData = async () => {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    mealTypes: getAllMealTypes(),
    labels: getAllLabels(),
    recipes: getAllRecipes(),
  };

  const file = new File(Paths.document, "chefplanner.json");
  file.write(JSON.stringify(data));
  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    dialogTitle: "Guardar backup",
  });
};

const importers: Record<number, (data: any) => void> = {
  1: (data: ExportData) => {
    data.mealTypes.forEach((mt) => createMealType(mt.name));
    data.labels.forEach((l) => createLabel(l.name));
    data.recipes.forEach((r) => createRecipe(r));
  },

  // If schema changes in the future:
  // 2: (data: ExportData) => { /* transform new data */ }
};

export const importData = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
  });
  if (result.canceled) return;

  const file = new File(result.assets[0].uri);
  const content = file.text();
  const data: ExportData = JSON.parse(await content);

  const importer = importers[data.version];
  if (!importer) throw new Error(`Version not supported: ${data.version}`);

  importer(data);

  return true;
};
