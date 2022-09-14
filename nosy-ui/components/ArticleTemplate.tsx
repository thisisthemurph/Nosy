import Meta from "components/Meta";
import CategoryList from "components/CategoryList";
import { MDXArticle } from "types/Article";

import styles from "styles/ArticleTemplate.module.css";

type Props = { article: MDXArticle };

const ArticleTemplate = ({ article }: Props) => {
  return (
    <>
      <Meta title={article.meta.title} keywords={article.meta.categories.map((c) => c.name)} />

      <h3 className={styles.title}>{article.meta.title}</h3>
      <p className={styles.author}>
        by <span className={styles.author__name}>{article.meta.author}</span>
      </p>

      <CategoryList categories={article.meta.categories} />

      {/* <MDXProvider>
        <main className={styles.contentContainer}>{article.content}</main>
      </MDXProvider> */}
    </>
  );
};

export default ArticleTemplate;
