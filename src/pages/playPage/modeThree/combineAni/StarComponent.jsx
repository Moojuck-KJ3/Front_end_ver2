import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./StarComponent.css";

const AnimationStar = ({ x, y, size }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [position, setPosition] = useState({ xp: 0, yp: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setPosition({
      xp: windowSize.width * x,
      yp: windowSize.height * y,
    });
  }, [windowSize, x, y]);

  return (
    <div
      className="absolute"
      style={{
        transform: `translate(-50%, -50%) translate(${position.xp}px, ${position.yp}px)`,
      }}
    >
      <div className="text-yellow-400">
        <FontAwesomeIcon icon={faStar} className={`fa-${size}x`} />
      </div>
    </div>
  );
};

export default AnimationStar;
