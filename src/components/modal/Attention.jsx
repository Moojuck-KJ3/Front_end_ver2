import { useEffect, useState } from "react";

const PopupContainer = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {children}
    </div>
  );
};

const Attention = ({ onClose }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onClose, 500); // Delay the onClose to allow the exit animation to play
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer if the component is unmounted
  }, [onClose]);

  return (
    <PopupContainer>
      <img
        className="animate-jump animate-infinite"
        src="/느낌표.png"
        alt="느낌표"
      />
    </PopupContainer>
  );
};

export default Attention;
