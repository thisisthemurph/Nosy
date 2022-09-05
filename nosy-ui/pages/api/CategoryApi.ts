import { db, supabase } from "../../config";
import { Article } from "../../types/Article";
import { Category } from "../../types/Category";
import { SupabaseResponse } from "./types";

export default class CategoriesApi {
  async get(): Promise<SupabaseResponse<Category[]>> {
    const { data, error } = await supabase
      .from<Category>(db.tables.categories)
      .select("id, name");

    return [data || [], error];
  }
}
