import { ChangeEvent, Dispatch, useEffect, useState } from "react";

import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { join } from "helpers/css";
import mdStyles from "styles/Markdown.module.scss";
import panelStyles from "styles/Panel.module.scss";
import articleStyles from "styles/ArticleForm.module.scss";
import Panel from "./Panel";
import PanelContainer from "./PanelContainer";

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

type MDXContent = MDXRemoteSerializeResult<
  Record<string, unknown>,
  Record<string, string>
>;

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
  const [mdx, setMdx] = useState<MDXContent>();

  useEffect(() => {
    const init = async () => {
      setMdx(await markdownToHtml(formData.content));
    };

    init();
  }, []);

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

  const markdownToHtml = async (source: string): Promise<MDXContent> => {
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

    return mdxContent;
  };

  return (
    <PanelContainer>
      <Panel>
        <form className={articleStyles.form}>
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

          <fieldset className={articleStyles.primary}>
            <label htmlFor="content">Content: </label>
            <textarea
              name="content"
              id="content"
              placeholder="Write the body of the content here"
              value={formData.content}
              onChange={async (e) => {
                handleChange(e);
                setMdx(await markdownToHtml(e.target.value));
              }}
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

          <fieldset className={articleStyles.test}>
            <section className={articleStyles.buttonGroup}>
              <p className={articleStyles.smallSuccess}>{actionCompleteMessage}</p>
              <button
                type="submit"
                onClick={handlePrimaryButtonClick}
                disabled={!primaryButtonActive}
                className={join(articleStyles.btn, articleStyles.btn__primary)}
              >
                {formType == ArticleFormType.Create ? "Create" : "Edit"}
              </button>
            </section>
          </fieldset>
        </form>
      </Panel>

      <Panel>
        <h3>{formData.title}</h3>
        <div className={mdStyles.markdown}>{mdx && <MDXRemote {...mdx} />}</div>
      </Panel>
    </PanelContainer>
  );
};

export default ArticleForm;
