import { ChangeEvent, Dispatch, useState } from "react";

import { join } from "../helpers/css";
import styles from "../styles/NewArticle.module.scss";

export interface ArticleFormData {
  id?: number;
  title: string;
  slug: string;
  content: string;
  author: string;
}

export enum ArticleFormType {
  Create = 0,
  Edit,
}

type Props = {
  formType: ArticleFormType;
  formData: ArticleFormData;
  setFormData: Dispatch<{
    name: string;
    value: string;
  }>;
  primaryButtonClick: (event: React.MouseEvent<HTMLElement>) => Promise<void>;
  primaryActionSuccessMessage?: string;
};

const ArticleForm = ({
  formData,
  setFormData,
  formType,
  primaryButtonClick,
  primaryActionSuccessMessage,
}: Props) => {
  const [primaryButtonActive, setPrimaryButtonActive] = useState(false);
  const [actionCompleteMessage, setActionCompleteMessage] = useState("");

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

    const { title, slug, content } = formData;
    setPrimaryButtonActive(title.length > 0 && slug.length > 0 && content.length > 0);
  };

  const handlePrimaryButtonClick = async (event: React.MouseEvent<HTMLElement>) => {
    setPrimaryButtonActive(false);

    await primaryButtonClick(event);

    setActionCompleteMessage(primaryActionSuccessMessage || "");
    setTimeout(() => setActionCompleteMessage(""), 15000);
  };

  return (
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

      <fieldset>
        <label htmlFor="author">Author: </label>
        <input
          name="author"
          id="author"
          placeholder="Who are you?"
          value={formData.author}
          onChange={handleChange}
        ></input>
      </fieldset>

      <fieldset className={styles.test}>
        <section className={styles.buttonGroup}>
          <p className={styles.smallSuccess}>{actionCompleteMessage}</p>
          <button
            type="submit"
            onClick={handlePrimaryButtonClick}
            disabled={!primaryButtonActive}
            className={join(styles.btn, styles.btn__primary)}
          >
            {formType == ArticleFormType.Create ? "Create" : "Edit"}
          </button>
        </section>
      </fieldset>
    </form>
  );
};

export default ArticleForm;
