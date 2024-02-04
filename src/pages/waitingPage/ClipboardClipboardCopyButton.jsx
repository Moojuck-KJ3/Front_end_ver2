import { useState } from "react";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Changed to use the ContentCopy icon

const CopyToClipboardButton = ({ gameCode }) => {
  // Accepts a gameCode prop
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    navigator.clipboard
      .writeText(gameCode) // Copies the gameCode prop
      .then(() => setOpen(true)) // Shows the Snackbar on successful copy
      .catch((err) => console.error("Could not copy text: ", err)); // Logs an error if the copy fails
  };

  return (
    <div
      className="flex gap-2 border p-2 m-2 rounded-lg hover:cursor-pointer hover:border-green-200 transition-all"
      onClick={handleClick}
    >
      <h1>{gameCode}</h1>
      <div color="primary">
        <ContentCopyIcon />
        <Snackbar
          message="친구에게 해당 룸ID를 보내주세요!" // Updated message
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Changed to match the position in the screenshot
          autoHideDuration={1000}
          onClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </div>
  );
};

export default CopyToClipboardButton;
