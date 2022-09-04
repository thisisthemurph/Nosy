import { db, supabase } from "../../config";
import { Article } from "../../types/Article";
import { Category } from "../../types/Category";

interface CategoryListResponse {
  data: Category[];
  error: any;
}

interface CategoryArticleGroup {
  name: string;
  articles: Article[];
}
interface CategoryArticlesResponse {
  data: CategoryArticleGroup | null;
  error: any;
}

export default class CategoriesApi {
  async get(): Promise<CategoryListResponse> {
    const { data, error } = await supabase
      .from<Category>(db.tables.categories)
      .select("id, name");

    return { data: data || [], error };
  }

  async getArticlesByCategory(
    category: string
  ): Promise<CategoryArticlesResponse> {
    console.log(`Looking for articles with category ${category}`);

    const { data, error } = await supabase
      .from<CategoryArticleGroup>(db.tables.categories)
      .select("name, articles(*)")
      .eq("name", category);

    console.log("getArticlesByCategory()");
    console.log(data);
    return { data: data ? data[0] : null, error };
  }
}
