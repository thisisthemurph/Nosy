import { db, supabase } from "../../config";
import { Category } from "../../types/Category";

export default class CategoriesApi {
  async get(): Promise<Category[]> {
    const { data: categories, error } = await supabase
      .from<Category>(db.tables.categories)
      .select("id, name");

    if (error) {
      console.error(error);
      return [];
    }

    return categories;
  }
}
