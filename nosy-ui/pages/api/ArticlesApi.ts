import supabase from "../../config/supabase";
import { Article, ArticleMetadata } from "../../types/Article";
import db from "../../config/database";
import { Categories } from "../../types/Category";

interface CategoryArticleMetadataFilter {
  name: string; // name of the category filtered on
  articles: ArticleMetadata[];
}

type ArticleResult = { data: Article | null; error: any };
type ArticleListResult = { data: Article[]; error: any };
type ArticleMetadataResult = { data: ArticleMetadata | null; error: any };
type ArticleMetadataListResult = { data: ArticleMetadata[]; error: any };
type CategoryArticleMetadataFilterResult = {
  data: CategoryArticleMetadataFilter[] | null;
  error: any;
};

const queries = {
  allMetadata: () =>
    supabase.from<ArticleMetadata>(db.tables.articles).select(`
    id, slug, title, author, createdAt,
    categories(id, name)  
  `),

  allMetadataByCategory: (category: Categories) =>
    supabase
      .from(db.tables.categories)
      .select(
        `name,
        ${db.tables.articles}(id, slug, title, author, createdAt, categories(id, name))  
      `
      )
      .eq("id", category),
};

export default class ArticlesApi {
  async getAll(): Promise<ArticleListResult> {
    const { data, error } = await supabase
      .from<Article>(db.tables.articles)
      .select(`*, categories(id, name)`);

    return { data: data || [], error };
  }

  async get(id: number): Promise<ArticleResult> {
    const { data, error } = await supabase
      .from<Article>(db.tables.articles)
      .select(`*, categories(id, name)`)
      .eq("id", id)
      .limit(1);

    return { data: data ? data[0] : data, error };
  }

  async getBySlug(slug: string): Promise<ArticleResult> {
    const { data, error } = await supabase
      .from<Article>(db.tables.articles)
      .select(`*, categories(id, name)`)
      .eq("slug", slug)
      .limit(1);

    return { data: data ? data[0] : data, error };
  }

  async getByCategory(category: string): Promise<ArticleResult> {
    const { data, error } = await supabase
      .from(db.tables.articles)
      .select(`*, categories(id, name)`)
      .eq("categories.name", category)
      .limit(1);

    return { data: data ? data[0] : data, error };
  }

  async getAllMetadata(
    category: Categories | null = null
  ): Promise<ArticleMetadataListResult> {
    if (!category) {
      const { data, error } = await queries.allMetadata();

      if (error) {
        console.warn(
          `Error selecting article metadata for category ${category}`
        );
        console.error(error);
        return { data: [], error };
      }

      return { data: data || [], error };
    }

    const { data, error } = (await queries.allMetadataByCategory(
      category
    )) as CategoryArticleMetadataFilterResult;

    return { data: data ? data[0].articles : [], error };
  }

  async getMetadata(id: number): Promise<ArticleMetadataResult> {
    const { data, error } = await supabase
      .from<ArticleMetadata>(db.tables.articles)
      .select(
        `id, slug, title, author, createdAt,
        categories(name)`
      )
      .eq("id", id)
      .limit(1);

    return { data: data ? data[0] : data, error };
  }
}
