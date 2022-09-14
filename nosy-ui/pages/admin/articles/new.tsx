import { ChangeEvent, useReducer } from "react";
import { join } from "../../../helpers/css";
import styles from "../../../styles/NewArticle.module.scss";

interface ArticleForm {
  title: string;
  slug: string;
  content: string;
}

const formReducer = (state: ArticleForm, target: { name: string; value: string }) => {
  return {
    ...state,
    [target.name]: target.value,
  };
};

const NewArticlePage = () => {
  const [formData, setFormData] = useReducer(formReducer, { title: "", slug: "", content: "" });

  const titleToSlug = (title: string): string => {
    // TODO: Enure special characters are not in the URL
    return title.replace(/\s+/g, "-").toLocaleLowerCase();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ name: e.target.name, value: e.target.value });

    // Update the slug if the titl has been updated
    if (e.target.name === "title") {
      setFormData({ name: "slug", value: titleToSlug(e.target.value) });
    }
  };

  const handleCreate = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    console.log("Saving");
  };

  const handleSaveAsDraft = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    console.log("Saving as draft");
  };

  const canSubmit = (): boolean => {
    const { title, slug, content } = formData;
    return title.length > 0 && slug.length > 0 && content.length > 0;
  };

  return (
    <>
      <h2>{formData.title || "New Article"}</h2>

      <form className={styles.form}>
        <fieldset>
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="The title of the article"
            value={formData.title}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="title">Slug: </label>
          <input
            type="text"
            name="slug"
            id="slug"
            placeholder="The URL identifier for the article"
            value={formData.slug}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="content">Content: </label>
          <textarea
            name="content"
            id="content"
            placeholder="Write the body of the content here"
            value={formData.content}
            onChange={handleChange}
          ></textarea>
        </fieldset>
        <fieldset className={styles.test}>
          <section className={styles.buttonGroup}>
            <button
              type="submit"
              onClick={handleSaveAsDraft}
              className={join(styles.btn, styles.btn__outline)}
            >
              Save as draft
            </button>
            <button
              type="submit"
              onClick={handleCreate}
              disabled={!canSubmit()}
              className={join(styles.btn, styles.btn__primary)}
            >
              Create
            </button>
          </section>
        </fieldset>
      </form>
    </>
  );
};

export default NewArticlePage;
