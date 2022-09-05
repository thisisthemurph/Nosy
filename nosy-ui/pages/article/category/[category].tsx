import { GetStaticPaths, GetStaticProps } from "next";
import ArticleTemplate from "../../../components/Article";
import ArticleList from "../../../components/ArticleList";
import Meta from "../../../components/Meta";
import { Article } from "../../../types/Article";
import ArticlesApi from "../../api/ArticlesApi";
import CategoriesApi from "../../api/CategoryApi";

type Props = {
  articles: Article[];
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

export const getStaticProps: GetStaticProps = async (context) => {
  // Get category from the URL parameter
  const defaultResult = {
    props: {
      article: null,
      fallback: false,
    },
  };

  if (!context.params) {
    console.error("Error building static props: could not determine params");
    return defaultResult;
  }

  const categoryParam = context.params.category as string | undefined;
  if (!categoryParam) {
    console.error("Error building static props: could not determine category");
    return defaultResult;
  }

  const category = fromUrlParam(categoryParam);

  // Fetch the articles associated with the category
  const Articles = new ArticlesApi();
  const [acg, error] = await Articles.getArticlesByCategory(category);

  if (error) {
    console.warn("Error fetching articles in getStaticProps [categories]");
    console.error(error);
  }

  return {
    props: {
      ...defaultResult.props,
      articles: acg?.articles || [],
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const Categories = new CategoriesApi();
  const [categories, error] = await Categories.get();

  if (error) {
    console.warn("Error building paths for [category]");
    console.error(error);

    return {
      paths: [],
      fallback: false,
    };
  }

  const paths = categories.map((c) => ({
    params: { category: toUrlParam(c.name) },
  }));

  return {
    paths,
    fallback: false,
  };
};

const toUrlParam = (name: string): string => {
  return name.toLowerCase().replace(" ", "-");
};

const fromUrlParam = (param: string): string => {
  return param
    .split("-")
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1)) // Title case
    .join(" ");
};
