import Meta from "components/Meta";
import Header from "components/Header";
import styles from "styles/Main.module.css";

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
