import { GetStaticPaths, GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import ArticlesApi from "../api/ArticlesApi";
import CategoryList from "../../components/CategoryList";
import Meta from "../../components/Meta";
import { Article, MDXArticle } from "../../types/Article";

import styles from "../../styles/ArticleTemplate.module.css";
import matter from "gray-matter";

type Props = {
  article: MDXArticle;
};

const ArticlePage = ({ article }: Props) => {
  return (
    <>
      <Meta title={article.meta.title} keywords={article.meta.categories.map((c) => c.name)} />

      <h3 className={styles.title}>{article.meta.title}</h3>
      <p className={styles.author}>
        by <span className={styles.author__name}>{article.meta.author}</span>
      </p>

      <CategoryList categories={article.meta.categories} />

      <main className={styles.contentContainer}>
        <MDXRemote {...article.content} />
      </main>
    </>
  );
};

export default ArticlePage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const Articles = new ArticlesApi();
  const { content: source, meta } = (await Articles.getBySlug(slug)) as Article;

  console.log({ meta });

  const { content } = matter(source);
  const mdxContent = await serialize(content, {
    // made available to the arguments of any custom mdx component
    scope: {},
    // MDX's available options, see the MDX docs for more info.
    // https://mdxjs.com/packages/mdx/#compilefile-options
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      format: "mdx",
    },
    // Indicates whether or not to parse the frontmatter from the mdx source
    parseFrontmatter: false,
  });

  const article: MDXArticle = { meta, content: mdxContent };

  return { props: { article } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const Articles = new ArticlesApi();
  const articles = await Articles.getAllMetadata();

  const slugs = articles.map((a) => a.slug);
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
