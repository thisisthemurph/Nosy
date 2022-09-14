import { GetStaticPaths, GetStaticProps } from "next";

import Meta from "components/Meta";
import ArticleList from "components/ArticleList";

import { ArticleMetadata } from "types/Article";
import { getAllCategories } from "pages/api/categories";
import { getMetadatByCategory } from "pages/api/articles";
import { categoryFromUrlParam, categoryToUrlParam } from "helpers/categories";

type Props = {
  articles: ArticleMetadata[];
};

const CategoryArticlePage = ({ articles }: Props) => {
  if (!articles || articles.length === 0) {
    return <p>No articles</p>;
  }

  return (
    <>
      <Meta title={`Category specific page`} />
      <ArticleList articles={articles} />
    </>
  );
};

export default CategoryArticlePage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let { category } = params as { category: string };
  category = categoryFromUrlParam(category);

  const articles = await getMetadatByCategory(category);

  return { props: { articles } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getAllCategories();

  const paths = categories.map((c) => ({
    params: { category: categoryToUrlParam(c.name) },
  }));

  return {
    paths,
    fallback: false,
  };
};
