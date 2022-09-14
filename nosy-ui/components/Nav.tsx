import Link from "next/link";
import { useState } from "react";

import { join } from "helpers/css";
import styles from "styles/Nav.module.scss";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const draweStyles = join(styles.nav__drawer, isOpen ? styles["nav__drawer--open"] : "");

  return (
    <nav className={styles.nav}>
      <MenuButton click={openDrawer} />
      <section className={draweStyles}>
        <header className={styles.nav__header}>
          <h2 className={styles.nav__logo}>Nosy</h2>
          <CloseButton click={closeDrawer} />
        </header>
        <Link href="/">
          <a className={styles.nav__link} onClick={closeDrawer}>
            Home
          </a>
        </Link>
        <Link href="/about">
          <a className={styles.nav__link} onClick={closeDrawer}>
            About
          </a>
        </Link>
      </section>
    </nav>
  );
};

type MenuButtonProps = { click: () => void };

const MenuButton = ({ click }: MenuButtonProps) => {
  return (
    <button className={styles.menuBtn} aria-label="Menu" onClick={click}>
      <svg height="15" viewBox="0 0 24 15" width="24" xmlns="http://www.w3.org/2000/svg">
        <g fill="#fff">
          <path d="m0 0h16v1h-16z"></path>
          <path d="m0 7h24v1h-24z"></path>
          <path d="m0 14h20v1h-20z"></path>
        </g>
      </svg>
    </button>
  );
};

type CloseButtonProps = { click: () => void };

const CloseButton = ({ click }: CloseButtonProps) => {
  return (
    <button className={styles.closeBtn} aria-label="Close" onClick={click}>
      <svg
        fill="currentcolor"
        height="20px"
        viewBox="0 0 24 24"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.5303 6.53033C18.8232 6.23744 18.8232 5.76256 18.5303 5.46967C18.2374 5.17678 17.7626 5.17678 17.4697 5.46967L12 10.9393L6.53033 5.46967C6.23744 5.17678 5.76256 5.17678 5.46967 5.46967C5.17678 5.76256 5.17678 6.23744 5.46967 6.53033L10.9393 12L5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L12 13.0607L17.4697 18.5303C17.7626 18.8232 18.2374 18.8232 18.5303 18.5303C18.8232 18.2374 18.8232 17.7626 18.5303 17.4697L13.0607 12L18.5303 6.53033Z"></path>
      </svg>
    </button>
  );
};

export default Nav;
