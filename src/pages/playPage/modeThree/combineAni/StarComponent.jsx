import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./StarComponent.css";
import RadialLines from "./RadialLines";

const AnimationStar = ({ x, y, size }) => {
  return (
    <div style={{ position: "relative" }}>
      <RadialLines x={x} y={y} /> {/* RadialLines 컴포넌트를 렌더링합니다. */}
      <div
        className={`w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500 animation-star`}
        style={{
          position: "absolute",
          top: `${y}%`,
          left: `${x}%`,
          transform: `scale(${size})`,
        }}
      >
        <div className="text-yellow-400">
          <FontAwesomeIcon icon={faStar} />
        </div>
      </div>
    </div>
  );
};

export default AnimationStar;
