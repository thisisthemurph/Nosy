import Nav from "components/Nav";

import { join } from "helpers/css";
import main from "styles/Main.module.css";
import styles from "styles/Header.module.scss";

const Header = () => {
  return (
    <header className={join(main.container, styles.header)}>
      <section className="logo">
        <h1>Nosy</h1>
      </section>
      <section className="navigation">
        <Nav />
      </section>
    </header>
  );
};

export default Header;
