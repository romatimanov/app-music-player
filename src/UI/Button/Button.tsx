import "./button.css";

type ButtonProps = {
  text: string;
  onClick?: () => void;
};

export function Button({ text, onClick }: ButtonProps): JSX.Element {
  return (
    <button onClick={onClick} className={`button`}>
      {text}
    </button>
  );
}
