import { Category } from "./Category";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface ArticleMetadata {
  id: number;
  slug: string;
  title: string;
  exerpt: string;
  author: string;
  categories: Category[];
}

export interface Article {
  meta: ArticleMetadata;
  content: string;
}

export interface MDXArticle {
  meta: ArticleMetadata;
  content: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>;
  rawContent: string;
}

export interface ArticleCategoryGroup {
  name: string;
  articles: Article[];
}