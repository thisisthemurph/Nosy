import Link from "next/link";

import { Category } from "types/Category";
import { categoryToUrlParam } from "helpers/categories";

import styles from "styles/CategoryList.module.css";

type Props = { categories: Category[] };

const CategoryList = ({ categories }: Props) => {
  return (
    <section className={styles.categoryList}>
      {categories.map((c, i) => {
        return (
          <Link key={i} href={`/article/category/${categoryToUrlParam(c.name)}`}>
            <a className={makeCategoryClassName(c.name)} key={i}>
              {c.name}
            </a>
          </Link>
        );
      })}
    </section>
  );
};

const makeCategoryClassName = (category: string): string => {
  const className = `category__${category.toLowerCase().replace(" ", "")}`;
  return `${styles.category} ${styles[className]}`;
};

export default CategoryList;
