import { GetStaticPaths, GetStaticProps } from "next";
import Meta from "../../../components/Meta";
import { Article } from "../../../types/Article";
import { Category } from "../../../types/Category";
import ArticlesApi from "../../api/ArticlesApi";
import CategoriesApi from "../../api/CategoryApi";

type Props = {
  article: Article;
};

const CategoryArticlePage = ({
  article: { title, content, categories, author },
}: Props) => {
  return (
    <>
      <Meta title={title} keywords={categories.map((c) => c.name)} />

      <h3>{title}</h3>
      <p className="author">
        by <span className="author__name">{author}</span>
      </p>

      <div>
        {categories.map((c, i) => (
          <p key={i}>{c.name}</p>
        ))}
      </div>

      <main className="content">{content}</main>
    </>
  );
};

export default CategoryArticlePage;

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

  const category = context.params.category as string | undefined;

  if (!category) {
    return defaultResult;
  }

  const api = new ArticlesApi();
  const { data: article, error } = await api.getByCategory(category);

  return {
    props: {
      ...defaultResult.props,
      article,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const api = new CategoriesApi();
  const { data: categories, error } = await api.get();

  const results = [];
  for (const cat of categories) {
    const { data, error } = await api.getArticlesByCategory(cat.name);
    results.push(data);
  }

  // TODO: Finish making the paths for the [category]

  //   const api = new ArticlesApi();
  //   const { data: articles, error } = await api.getAllMetadata();

  //   if (error) {
  //     console.error(error);
  //     throw Error("Error building article paths");
  //   }

  //   const slugs = articles.map((a) => a.slug);
  //   const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths: [],
    fallback: false,
  };
};
