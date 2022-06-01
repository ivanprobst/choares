import styles from "../styles/Spinner.module.scss";

const Spinner = () => {
  return (
    <svg className={styles.spinner} viewBox="0 0 50 50" stroke="currentColor">
      <circle
        className={styles.spinnerPath}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="8"
      />
    </svg>
  );
};

export default Spinner;
