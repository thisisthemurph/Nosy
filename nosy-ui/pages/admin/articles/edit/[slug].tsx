import { GetServerSideProps } from "next";
import { useReducer } from "react";

import { Article } from "types/Article";
import { getBySlug, updateArticle } from "pages/api/articles";
import ArticleForm, { ArticleFormType, ArticleFormData } from "components/ArticleForm";

const formReducer = (state: ArticleFormData, target: { name: string; value: string }) => {
  return {
    ...state,
    [target.name]: target.value,
  };
};

type Props = {
  article: Article | null;
};

const EditArticlePage = ({ article }: Props) => {
  const [formData, setFormData] = useReducer(
    formReducer,
    article
      ? {
          title: article.meta.title,
          slug: article.meta.slug,
          content: article.content,
          author: article.meta.author,
        }
      : {
          title: "",
          slug: "",
          content: "",
          author: "",
        }
  );

  const handleUpdate = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (article === null) {
      return;
    }

    await updateArticle(article.meta.id, formData);
  };

  if (article === null) {
    return (
      <>
        <h2>New Article</h2>
        <p>Could not locate the specified article, check the URL and try again.</p>
      </>
    );
  }

  return (
    <ArticleForm
      formData={formData}
      setFormData={setFormData}
      formType={ArticleFormType.Edit}
      primaryButtonClick={handleUpdate}
      primaryActionSuccessMessage="Saved"
    />
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const article = await getBySlug(slug);

  return {
    props: { article },
  };
};

export default EditArticlePage;
