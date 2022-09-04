import { ArticleMetadata } from "../types/Article";
import styles from "../styles/Tile.module.css";
import Link from "next/link";

type Props = {
  article: ArticleMetadata;
};

const Tile = ({ article }: Props) => {
  return (
    <div className={styles.tile}>
      <Link href={`article/${article.slug}`}>
        <a>
          <h4 className={styles.tile__title}>{article.title}</h4>
        </a>
      </Link>
      <div className={styles.tile__categoryList}>
        {article.categories.map((c, i) => (
          <p key={i} className={makeCategoryClassName(c.name)}>
            {c.name}
          </p>
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
