import { ArticleMetadata } from "../types/Article";
import Tile from "./Tile";

import styles from "../styles/TileList.module.css";

type Props = {
  articles: ArticleMetadata[];
};

const ArticleList = ({ articles }: Props) => {
  if (!articles || articles.length === 0) {
    return (
      <div>
        <p>There are no articles to present</p>
      </div>
    );
  }

  return (
    <div className={styles.tileList}>
      {articles.map((a, i) => (
        <Tile key={i} article={a} />
      ))}
    </div>
  );
};

export default ArticleList;
