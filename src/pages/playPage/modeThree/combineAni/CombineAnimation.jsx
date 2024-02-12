import React from "react";
import AnimationStar from "./StarComponent";

// 아마 입력 받을때
// position 같은 요소를 생각해서 받아야 할듯
const CombineAnimation = ({ onAnimationEnd, combinedplaceList }) => {
  const positions = combinedplaceList.map((place) => {
    return {
      x: place.x,
      y: place.y,
      size: 3, // 나중에 사이즈 조절 필요(어떤 배열에 어떤 사이즈가 들어가야 하는지 확인 필요)
    };
  });

  return (
    <div className="relative">
      {positions.map((position, i) => (
        <AnimationStar
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
