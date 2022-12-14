import Head from "next/head";

type Props = {
  title: string;
  keywords: string[];
  description: string;
};

const Meta = ({ title, keywords, description }: Props) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  );
};

Meta.defaultProps = {
  title: "Nosy Media - What is really going on out there?",
  keywords: ["right wing", "media", "truth", "news"],
  description:
    "At nosy media, we cut through the crap and really tell you what's happening",
};

export default Meta;
