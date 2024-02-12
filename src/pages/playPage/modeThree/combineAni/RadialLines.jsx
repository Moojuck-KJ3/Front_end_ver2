import React from "react";
import "./RadialLines.css"; // CSS 파일을 import 합니다.

const RadialLines = ({ x, y }) => {
  const lines = [];

  // 별 주변에 원형으로 배치된 선들을 생성합니다.
  for (let angle = 0; angle < 360; angle += 15) {
    lines.push(
      <div
        key={angle}
        className="radial-line"
        style={{
          transform: `rotate(${angle}deg) translateX(50%)`, // 회전과 위치 조정
        }}
      />
    );
  }

  return (
    <div
      className="radial-lines-container"
      style={{ top: `${y}%`, left: `${x}%` }} // 별의 위치에 따라 조정
    >
      {lines}
    </div>
  );
};

export default RadialLines;
