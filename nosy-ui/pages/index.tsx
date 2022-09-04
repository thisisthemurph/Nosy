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
  const api = new ArticlesApi();
  const { data: articles, error } = await api.getAllMetadata();

  if (error) {
    console.warn("Error fetching articles for the home page");
    console.error(error);

    return {
      props: {
        articles: [],
        error: "Unable to obtain relevant articles.",
      },
    };
  }

  return {
    props: {
      articles,
      error: null,
    },
  };
};
