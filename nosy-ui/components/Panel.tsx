import React from "react";
import panelStyles from "styles/Panel.module.scss";

type Props = { children: React.ReactNode };

const Panel = ({ children }: Props) => {
  return <div className={panelStyles.panel}>{children}</div>;
};

export default Panel;
