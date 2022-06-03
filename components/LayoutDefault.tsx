import { ReactNode } from "react";
import Link from "next/link";

import styles from "../styles/Layout.module.scss";
import useLocale from "../hooks/useLocale";
import { ROUTES } from "../utils/constants";

export const LayoutDefault = ({ children }: { children: ReactNode }) => {
  const { t } = useLocale();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <Link href={ROUTES.home}>{t.common.choares}</Link>
        </h1>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p className={styles.groupContainer}>
          {t.about.copyright},{" "}
          <a
            href={t.about.urlWebsite}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.about.website}
          </a>
        </p>

        <nav>
          <a href={t.about.urlGithub} target="_blank" rel="noopener noreferrer">
            {t.about.github}
          </a>
        </nav>
      </footer>
    </div>
  );
};
