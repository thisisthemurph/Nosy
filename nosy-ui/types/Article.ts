import { Category } from "./Category";

export interface ArticleMetadata {
  id: number;
  slug: string;
  title: string;
  content: string;
  author: string;
  categories: Category[];
}

export interface Article extends ArticleMetadata {
  content: string;
}
