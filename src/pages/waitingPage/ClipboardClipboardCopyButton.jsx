import { useState } from "react";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Changed to use the ContentCopy icon

const CopyToClipboardButton = ({ roomId }) => {
  // Accepts a gameCode prop
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => setOpen(true))
      .catch((err) => console.error("Could not copy text: ", err));
  };

  return (
    <div
      className="flex gap-2  text-gray-600 bg-gray-100 py-1 font-bold px-4 m-1 rounded-lg hover:cursor-pointer hover:bg-green-100 transition-all"
      onClick={handleClick}
    >
      <h1>{roomId}</h1>
      <div color="primary">
        <ContentCopyIcon />
        <Snackbar
          message="룸ID를 복사했습니다!" // Updated message
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </div>
  );
};

export default CopyToClipboardButton;
