import db from "../../config/database";
import { SupabaseResponse } from "./types";
import supabase from "../../config/supabase";
import { Article, ArticleMetadata } from "../../types/Article";

export default class ArticlesApi {
  /**
   * Retrieves all metadata from the database
   * @returns an array of ArticleMetadata - empty array when error
   */
  async getAllMetadata(): Promise<ArticleMetadata[]> {
    const { data: articles, error } = await supabase
      .from<ArticleMetadata>(db.tables.articles)
      .select("id, slug, title, exerpt:content, author, categories(id, name)");

    if (error) {
      console.error(error);
      return [];
    }

    return articles.map((a) => ({ ...a, exerpt: this.trimExerpt(a.exerpt) }));
  }

  /**
   * Retrieves article metadata based on the unique slug
   * @param slug the slug of the article metadata to be fetched
   * @returns ArticleMetadata or `null` in the event of an error
   */
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

    return {
      ...data[0],
      exerpt: this.trimExerpt(data[0].exerpt),
    };
  }

  /**
   * Retrieves all metadata associated with the category
   * @param category to be filtered on
   * @returns an array of ArtlcleMetadata - empty in the event of an error
   */
  async getMetadatByCategory(category: string): Promise<ArticleMetadata[]> {
    const { data: articles, error } = (await supabase
      .from(db.tables.articles)
      .select("id, slug, title, exerpt:content, author, categories(id, name)")
      .eq("categories.name", category)) as SupabaseResponse<ArticleMetadata[]>;

    if (error) {
      console.error(error);
      return [];
    }

    return articles.map((a) => ({ ...a, exerpt: this.trimExerpt(a.exerpt) }));
  }

  /**
   * Retrieves the content body of the article based on the slug
   * @param slug the slug
   * @returns string of content or null in the event of an error
   */
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

  /**
   * Retrieves an artcile based on the slug
   * @param slug to be fetched
   * @returns the Article or null in the event of an error
   */
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

  private trimExerpt(content: string): string {
    return content.slice(0, 200) + "...";
  }
}
