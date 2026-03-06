import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import { ExportData } from "../types/ExportData";

import {
  getAllMealTypes,
  getAllLabels,
  getAllRecipes,
  createMealType,
  createLabel,
  createRecipe,
} from "./db/database.service";

export const exportData = async () => {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    mealTypes: getAllMealTypes(),
    labels: getAllLabels(),
    recipes: getAllRecipes(),
  };

  const file = new File(Paths.document, "autocook_backup.json");
  file.write(JSON.stringify(data));
  await Sharing.shareAsync(file.uri);
};

const importers: Record<number, (data: any) => void> = {
  1: (data: ExportData) => {
    data.mealTypes.forEach((mt) => createMealType(mt.name));
    data.labels.forEach((l) => createLabel(l.name));
    data.recipes.forEach((r) => createRecipe(r));
  },

  // en el futuro si el schema cambia:
  // 2: (data) => { /* transformar campos nuevos */ }
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
  if (!importer) throw new Error(`Versión no soportada: ${data.version}`);

  importer(data);
};
