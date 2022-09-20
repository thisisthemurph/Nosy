import { GetStaticPaths, GetStaticProps } from "next";

import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { MDXArticle } from "types/Article";
import { serialize } from "next-mdx-remote/serialize";

import Meta from "components/Meta";
import CategoryList from "components/CategoryList";
import { getAllMetadata, getBySlug } from "pages/api/articles";

import mdStyles from "styles/Markdown.module.scss";
import styles from "styles/ArticleTemplate.module.css";

type Props = {
  article: MDXArticle;
};

const ArticlePage = ({ article }: Props) => {
  return (
    <>
      <Meta
        title={article.meta.title}
        keywords={article.meta.categories.map((c) => c.name)}
      />

      <h3 className={styles.title}>{article.meta.title}</h3>
      <p className={styles.author}>
        by <span className={styles.author__name}>{article.meta.author}</span>
      </p>

      <CategoryList categories={article.meta.categories} />

      <main className={mdStyles.markdown}>
        <MDXRemote {...article.content} />
      </main>
    </>
  );
};

export default ArticlePage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const article = await getBySlug(slug);
  if (article === null) {
    return { notFound: true };
  }

  const { content: source, meta } = article;

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

  const mdxArticle: MDXArticle = { meta, content: mdxContent };
  return { props: { article: mdxArticle } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllMetadata();

  const slugs = articles.map((a) => a.slug);
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
