import styles from "../styles/Home.module.css";

export const TabsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.tabsContainer}>{children}</div>;
};

export const Tab = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button className={styles.tab} onClick={onClick}>
      {children}
    </button>
  );
};
