import React, { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const KeyWordFlippableCard = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseEnter = () => {
    setIsFlipped(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
    setIsHovered(false);
  };

  return (
    <Card
      sx={{
        width: isFlipped ? 300 : isHovered ? 320 : 300,
        height: 60,
        perspective: "1000px",
        transition: "transform 0.8s, width 0.5s",
        transformStyle: "preserve-3d",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent>
        <Typography variant="body1" component="div">
          {isFlipped ? "" : children}
        </Typography>
      </CardContent>
      <CardContent
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: isFlipped ? "block" : isHovered ? "block" : "none",
          transform: "rotateY(180deg)",
        }}
      >
        {isFlipped && (
          <>
            <Button variant="contained">Button 1</Button>
            <Button variant="contained">Button 2</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KeyWordFlippableCard;
