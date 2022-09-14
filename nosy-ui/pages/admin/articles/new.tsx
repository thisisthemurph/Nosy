import { useReducer } from "react";

import ArticleForm, { ArticleFormType } from "../../../components/ArticleForm";
import { ArticleFormData } from "../../../components/ArticleForm";
import { saveArticle } from "../../api/articles";

const formReducer = (state: ArticleFormData, target: { name: string; value: string }) => {
  return {
    ...state,
    [target.name]: target.value,
  };
};

const NewArticlePage = () => {
  const [formData, setFormData] = useReducer(formReducer, {
    title: "",
    slug: "",
    content: "",
    author: "",
  });

  const handleSave = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const { success, message } = await saveArticle(formData);
  };

  return (
    <ArticleForm
      formData={formData}
      setFormData={setFormData}
      formType={ArticleFormType.Create}
      primaryButtonClick={handleSave}
    />
  );
};

export default NewArticlePage;
