import React from "react";
import StarComponent from "./StarComponent";

// 아마 입력 받을때
// position 같은 요소를 생각해서 받아야 할듯
const CombineAnimation = ({ onAnimationEnd, combinedplaceList }) => {
  const positions = combinedplaceList.map((place) => {
    return {
      x: place.position.x,
      y: place.position.y,
      size: 1.5,
    };
  });

  return (
    <div>
      {positions.map((position, i) => (
        <StarComponent
          key={i}
          x={position.x}
          y={position.y}
          size={position.size}
        />
      ))}
    </div>
  );
};

export default CombineAnimation;
