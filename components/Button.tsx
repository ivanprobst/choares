import styles from "../styles/Home.module.css";
import Spinner from "./Spinner";

const Button = ({
  children,
  onClick,
  type = "green",
  isLoading = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "green" | "red" | "blue";
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  const buttonStyle =
    type === "green"
      ? styles.buttonGreen
      : type === "red"
      ? styles.buttonRed
      : styles.buttonBlue;

  return (
    <button
      className={`${styles.button} ${buttonStyle}`}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {children}
      {isLoading && <Spinner />}
    </button>
  );
};

export default Button;
