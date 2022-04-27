import styles from "../styles/Home.module.css";

const Button = ({
  children,
  onClick,
  type = "green",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "green" | "red" | "blue";
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
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
