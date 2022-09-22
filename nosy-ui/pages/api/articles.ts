import db from "config/database";
import supabase from "config/supabase";

import { ArticlesTable } from "types/Database";
import { Article, ArticleMetadata } from "types/Article";

/**
 * Retrieves all metadata from the database
 * @returns an array of ArticleMetadata - empty array when error
 */
export const getAllMetadata = async (): Promise<ArticleMetadata[]> => {
  const { data: articles, error } = await supabase
    .from<ArticleMetadata>(db.tables.articles)
    .select("id, slug, title, exerpt:content, categories(id, name)");

  if (error) {
    console.error(error);
    return [];
  }

  return articles.map((a) => ({ ...a, exerpt: trimExerpt(a.exerpt) }));
};

/**
 * Retrieves article metadata based on the unique slug
 * @param slug the slug of the article metadata to be fetched
 * @returns ArticleMetadata or `null` in the event of an error
 */
export const getMetadataBySlug = async (
  slug: string
): Promise<ArticleMetadata | null> => {
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

  return {
    ...data[0],
    exerpt: trimExerpt(data[0].exerpt),
  };
};

/**
 * Retrieves all metadata associated with the category
 * @param category to be filtered on
 * @returns an array of ArtlcleMetadata - empty in the event of an error
 */
export const getMetadatByCategory = async (
  category: string
): Promise<ArticleMetadata[]> => {
  let { data: articles, error } = await supabase
    .from<ArticleMetadata>(db.tables.articles)
    .select("id, slug, title, exerpt:content, author, categories(id, name)");

  // TODO: Figure out how to do this query to filter on the category names
  // When doing `.eq("category.name", category)` it was returning all but
  // with only the specified category in the list of categories.
  // Current fix is to filter in JS.

  if (error || articles === null) {
    console.error(error);
    return [];
  }

  articles = articles.filter((a) => a.categories.map((c) => c.name).includes(category));
  return articles.map((a) => ({ ...a, exerpt: trimExerpt(a.exerpt) }));
};

/**
 * Retrieves the content body of the article based on the slug
 * @param slug the slug
 * @returns string of content or null in the event of an error
 */
export const getContentBySlug = async (slug: string): Promise<string | null> => {
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
};

/**
 * Retrieves an artcile based on the slug
 * @param slug to be fetched
 * @returns the Article or null in the event of an error
 */
export const getBySlug = async (slug: string): Promise<Article | null> => {
  const content = await getContentBySlug(slug);
  const metadata = await getMetadataBySlug(slug);

  if (content === null || metadata === null) {
    return null;
  }

  const article: Article = {
    meta: metadata,
    content,
  };

  return article;
};

export const saveArticle = async (
  article: ArticlesTable
): Promise<{ success: boolean; message?: string }> => {
  const existingArticle = await getBySlug(article.slug);
  if (existingArticle !== null) {
    return {
      success: false,
      message: "An article already exists with the given slug",
    };
  }

  const { error } = await supabase.from(db.tables.articles).insert({ ...article });

  if (error) {
    console.error(error);
    return {
      success: false,
      message: "There has been an issue saving the article",
    };
  }

  return { success: true };
};

export const updateArticle = async (
  articleId: number,
  newArticleData: ArticlesTable
): Promise<boolean> => {
  // Ensure the ID isn't submitted
  delete newArticleData.id;

  const { error } = await supabase
    .from("articles")
    .update(newArticleData)
    .eq("id", articleId);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
};

const trimExerpt = (content: string): string => {
  return content.slice(0, 200) + "...";
};
