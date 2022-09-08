import type { NextPage } from "next";

import { ArticleMetadata } from "../types/Article";
import ArticleList from "../components/ArticleList";
import ArticlesApi from "./api/ArticlesApi";

type Props = {
  articles: ArticleMetadata[];
};

const Home: NextPage<Props> = ({ articles }) => {
  return (
    <>
      <h1>Nosy</h1>
      <ArticleList articles={articles} />
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const Articles = new ArticlesApi();
  const articles = await Articles.getAllMetadata();

  return {
    props: {
      articles,
      error: null,
    },
  };
};
