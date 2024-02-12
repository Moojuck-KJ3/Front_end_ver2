import React from "react";
import AnimationStar from "./StarComponent";
import LineAnimation from "./LineAnimation";

const MAXLIMIT_RATE = 0.2;
const MINVALUE = -1000;
const MAXVALUE = 1000;

function compressValue(value) {
  let minRange = -MAXLIMIT_RATE;
  let maxRange = MAXLIMIT_RATE;

  let normalizedValue = (value - MINVALUE) / (MAXVALUE - MINVALUE); // 0~1 사이의 값으로 정규화
  let compressedValue = normalizedValue * (maxRange - minRange) + minRange;

  return compressedValue;
}

// 아마 입력 받을때
// position의 값을 임의의 비율로 변환하므로 적당히 높은 값을 넣을것
const CombineAnimation = ({ onAnimationEnd, combinedplaceList }) => {
  const positions = combinedplaceList.map((place) => {
    return {
      x: compressValue(place.x),
      y: compressValue(place.y),
      size: 3, // 나중에 사이즈 조절 필요(어떤 배열에 어떤 사이즈가 들어가야 하는지 확인 필요)
    };
  });

  return (
    <div className="relative">
      {positions.map((position, i) => {
        if (i % 2 === 0 && positions[i + 1]) {
          return (
            <LineAnimation
              key={i}
              startX={position.x}
              startY={position.y}
              endX={positions[i + 1].x}
              endY={positions[i + 1].y}
            />
          );
        }
        return (
          <LineAnimation
            key={i}
            startX={position.x}
            startY={position.y}
            endX={positions[positions.length - 1].x}
            endY={positions[positions.length - 1].y}
          />
        );
      })}
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
