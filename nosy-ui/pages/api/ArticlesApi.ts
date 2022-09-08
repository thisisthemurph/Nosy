import supabase from "../../config/supabase";
import { Article, ArticleMetadata, ArticleCategoryGroup } from "../../types/Article";
import db from "../../config/database";
import { Categories } from "../../types/Category";
import { SupabaseResponse } from "./types";
import { ArticlesTable } from "../../types/Database";

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

const MetadatSelectColumns = "id, slug, title, exerpt:content, author, categories(id, name)";

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
      .from(db.tables.articles)
      .select(`*, categories(id, name)`)
      .eq("id", id)
      .limit(1);

    return { data: data ? data[0] : data, error };
  }

  async getMetadataBySlug(slug: string): Promise<ArticleMetadata | null> {
    const { data, error } = await supabase
      .from<ArticleMetadata>(db.tables.articles)
      .select("id, slug, title, exerpt:content, author, categories(id, name)")
      .eq("slug", slug)
      .limit(1);

    if (error) {
      console.error(error);
      return null;
    }

    if (!data || data.length !== 1) {
      console.warn(`No article present for slug ${slug}`);
      return null;
    }

    const metadata = data[0];
    console.log({ metadata });

    // Only 200 characters in the exerpt
    metadata.exerpt = metadata.exerpt.slice(0, 200) + "...";
    return metadata;
  }

  async getContentBySlug(slug: string): Promise<string | null> {
    interface ContenResponse {
      slug: string;
      content: string;
    }

    const { data, error } = await supabase
      .from<ContenResponse>(db.tables.articles)
      .select("slug, content")
      .eq("slug", slug)
      .limit(1);

    if (error) {
      console.error(error);
      return null;
    }

    if (!data || data.length !== 1) {
      console.warn(`No article present for slug ${slug}`);
      return null;
    }

    return data[0].content;
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const content = await this.getContentBySlug(slug);
    const metadata = await this.getMetadataBySlug(slug);

    if (content === null || metadata === null) {
      return null;
    }

    const article: Article = {
      meta: metadata,
      content,
    };

    return article;
  }

  async getMetadataByCategory(category: string): Promise<ArticleMetadata[]> {
    const { data, error } = await supabase
      .from(db.tables.articles)
      .select(MetadatSelectColumns)
      .eq("categories.name", category);

    if (error) {
      return [];
    }

    if (data === null || data.length === 0) {
      return [];
    }

    return data;
  }

  async getAllMetadata(): Promise<ArticleMetadata[]> {
    const { data: articles, error } = await supabase
      .from<ArticleMetadata>(db.tables.articles)
      .select("id, slug, title, author, createdAt, categories(id, name)");

    if (error) {
      console.error(error);
      return [];
    }

    return articles || [];
  }

  async getMetadata(id: number): Promise<ArticleMetadataResult> {
    const { data, error } = await supabase
      .from<ArticleMetadata>(db.tables.articles)
      .select("id, slug, title, author, createdAt, categories(name)")
      .eq("id", id)
      .limit(1);

    return { data: data ? data[0] : data, error };
  }

  async getMetadatByCategory(category: string): Promise<ArticleMetadata[]> {
    const { data, error } = (await supabase
      .from(db.tables.articles)
      .select("id, slug, title, exerpt:content, author, categories(id, name)")
      .eq("categories.name", category)) as SupabaseResponse<ArticleMetadata[]>;

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  }
}
