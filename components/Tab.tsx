import React from "react";
import styles from "../styles/Home.module.css";

export const TabsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.tabsContainer}>{children}</div>;
};

export const Tab = ({
  children,
  onClick,
  current,
}: {
  children: React.ReactNode;
  onClick: () => void;
  current: boolean;
}) => {
  return (
    <button
      className={`${styles.tab} ${current ? styles.tabCurrent : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
