import Link from "next/link";
import Meta from "./Meta";
import { Article as ArticleTemplate } from "../types/Article";
import { categoryToUrlParam } from "../helpers/categories";
import styles from "../styles/ArticleTemplate.module.css";
import CategoryList from "./CategoryList";

type Props = { article: ArticleTemplate };

const ArticleTemplate = ({ article }: Props) => {
  return (
    <>
      <Meta title={article.title} keywords={article.categories.map((c) => c.name)} />

      <h3 className={styles.title}>{article.title}</h3>
      <p className={styles.author}>
        by <span className={styles.author__name}>{article.author}</span>
      </p>

      <CategoryList categories={article.categories} />

      <main className={styles.contentContainer}>{article.content}</main>
    </>
  );
};

export default ArticleTemplate;
