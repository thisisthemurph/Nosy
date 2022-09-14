import { GetStaticPaths, GetStaticProps } from "next";
import ArticleList from "../../../components/ArticleList";
import Meta from "../../../components/Meta";
import { categoryFromUrlParam, categoryToUrlParam } from "../../../helpers/categories";
import { ArticleMetadata } from "../../../types/Article";
import { getMetadatByCategory } from "../../api/articles";
import CategoriesApi from "../../api/CategoryApi";

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

export const getStaticPaths: GetStaticPaths = async (context) => {
  const Categories = new CategoriesApi();
  const categories = await Categories.get();

  const paths = categories.map((c) => ({
    params: { category: categoryToUrlParam(c.name) },
  }));

  return {
    paths,
    fallback: false,
  };
};
