import { GetStaticPaths, GetStaticProps } from "next";
import { Article } from "../../types/Article";
import ArticlesApi from "../api/ArticlesApi";
import ArticleTemplate from "../../components/ArticleTemplate";

type Props = {
  article: Article;
};

const ArticlePage = ({ article }: Props) => {
  return <ArticleTemplate article={article} />;
};

export default ArticlePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const defaultResult = {
    props: {
      article: null,
      fallback: false,
    },
  };

  if (!context.params) {
    return defaultResult;
  }

  const slug = context.params.slug as string | undefined;

  if (!slug) {
    return defaultResult;
  }

  const api = new ArticlesApi();
  const { data: article, error } = await api.getBySlug(slug);

  return {
    props: {
      ...defaultResult.props,
      article,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const api = new ArticlesApi();
  const { data: articles, error } = await api.getAllMetadata();

  if (error) {
    console.error(error);
    throw Error("Error building article paths");
  }

  const slugs = articles.map((a) => a.slug);
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
