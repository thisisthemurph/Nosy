import type { NextPage } from "next";

import ArticleList from "components/ArticleList";

import { ArticleMetadata } from "types/Article";
import { getAllMetadata } from "pages/api/articles";

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
  const articles = await getAllMetadata();

  return {
    props: {
      articles,
      error: null,
    },
  };
};
