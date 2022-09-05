import { Article as ArticleTemplate } from "../types/Article";
import Meta from "./Meta";

type Props = { article: ArticleTemplate };

const ArticleTemplate = ({ article }: Props) => {
  return (
    <>
      <Meta
        title={article.title}
        keywords={article.categories.map((c) => c.name)}
      />

      <h3>{article.title}</h3>
      <p className="author">
        by <span className="author__name">{article.author}</span>
      </p>

      <div>
        {article.categories.map((c, i) => (
          <p key={i}>{c.name}</p>
        ))}
      </div>

      <main className="content">{article.content}</main>
    </>
  );
};

export default ArticleTemplate;
