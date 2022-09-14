import Link from "next/link";

import { ArticleMetadata } from "types/Article";
import styles from "styles/Tile.module.css";

type Props = {
  article: ArticleMetadata;
};

const Tile = ({ article }: Props) => {
  const c = article.categories || [];
  const categories = c.map((x) => x.name);

  const toUrlParam = (name: string): string => {
    return name.toLowerCase().replace(" ", "-");
  };

  return (
    <div className={styles.tile}>
      <Link href={`/article/${article.slug}`}>
        <a>
          <h4 className={styles.tile__title}>{article.title}</h4>
        </a>
      </Link>
      <div className={styles.tile__categoryList}>
        {categories.map((name, i) => (
          <Link
            key={i}
            className={makeCategoryClassName(name)}
            href={`/article/category/${toUrlParam(name)}`}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};

const makeCategoryClassName = (category: string): string => {
  const className = `category__${category.toLowerCase().replace(" ", "")}`;
  return `${styles.category} ${styles[className]}`;
};

export default Tile;
