import Link from "next/link";
import Meta from "./Meta";
import { Article as ArticleTemplate } from "../types/Article";
import { categoryToUrlParam } from "../helpers/categories";
import styles from "../styles/ArticleTemplate.module.css";

type Props = { article: ArticleTemplate };

const ArticleTemplate = ({ article }: Props) => {
  return (
    <>
      <Meta title={article.title} keywords={article.categories.map((c) => c.name)} />

      <h3>{article.title}</h3>
      <p className="author">
        by <span className="author__name">{article.author}</span>
      </p>

      <div className={styles.categoryList}>
        {article.categories.map((c, i) => {
          return (
            <Link href={`/article/category/${categoryToUrlParam(c.name)}`}>
              <a className={styles.category} key={i}>
                {c.name}
              </a>
            </Link>
          );
        })}
      </div>

      <main className="content">{article.content}</main>
    </>
  );
};

export default ArticleTemplate;
