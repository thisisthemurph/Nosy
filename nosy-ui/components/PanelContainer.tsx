import { join } from "helpers/css";
import React, { useState } from "react";
import panelStyles from "styles/Panel.module.scss";

type Props = { children: React.ReactNode };

const PanelContainer = ({ children }: Props) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const panelContainerStyles = join(
    panelStyles.panel__container,
    isFullScreen ? panelStyles["panel__container--fullScreen"] : ""
  );

  return (
    <>
      <div className={panelContainerStyles}>
        <header>
          <button onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? "__" : "\u25a2"}
          </button>
        </header>
        <main className={panelStyles.panel__content}>{children}</main>
      </div>
    </>
  );
};

export default PanelContainer;
