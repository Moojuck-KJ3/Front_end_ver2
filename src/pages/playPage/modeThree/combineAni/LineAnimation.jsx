import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function LineAnimation({ startX, startY, endX, endY, onAnimationFirstEnd }) {
  const lineRef1 = useRef(null);
  const lineRef2 = useRef(null);

  useEffect(() => {
    const pixelStartX = startX * window.innerWidth;
    const pixelStartY = startY * window.innerHeight;
    const pixelEndX = endX * window.innerWidth;
    const pixelEndY = endY * window.innerHeight;

    const angle =
      Math.atan2(pixelEndY - pixelStartY, pixelEndX - pixelStartX) *
      (180 / Math.PI);

    gsap.set([lineRef1.current, lineRef2.current], {
      scaleX: 0,
      rotation: angle,
      transformOrigin: "left center",
    });
    gsap.to(lineRef1.current, {
      scaleX: 1,
      duration: 2,
      onComplete: onAnimationFirstEnd,
    });
    gsap.to(lineRef2.current, { scaleX: 1, duration: 2, delay: 2 });

    // 색상 애니메이션
    gsap.to([lineRef1.current, lineRef2.current], {
      backgroundColor: "blue",
      repeat: -1,
      yoyo: true,
      duration: 1,
    });

    // 선 굵기 애니메이션
    gsap.to([lineRef1.current, lineRef2.current], {
      height: "5px",
      repeat: -1,
      yoyo: true,
      duration: 1,
    });
  }, [startX, startY, endX, endY]);

  const length = Math.sqrt(
    Math.pow(endX * window.innerWidth - startX * window.innerWidth, 2) +
      Math.pow(endY * window.innerHeight - startY * window.innerHeight, 2)
  );

  return (
    <>
      <div
        ref={lineRef1}
        style={{
          position: "absolute",
          left: `${startX * window.innerWidth}px`,
          top: `${startY * window.innerHeight}px`,
          width: `${length}px`,
          height: "3px",
          background: "white",
          opacity: 0.8,
        }}
      />
      <div
        ref={lineRef2}
        style={{
          position: "absolute",
          left: `${startX * window.innerWidth}px`,
          top: `${startY * window.innerHeight}px`,
          width: `${length}px`,
          height: "3px",
          background: "white",
          opacity: 0.8,
        }}
      />
    </>
  );
}

export default LineAnimation;
