import { useState } from "react";
import "react-step-progress-bar/styles.css";
import Typewriter from "../../components/type/TypeWriter";

export function StepperWithContent({ setRoomMode }) {
  const steps = [
    { name: "탐색", image: "/Star_2.png" },
    { name: "추천", image: "/Star_3.png" },
    { name: "조합", image: "/Food.png" },
    { name: "마무리", image: "/돈까스.png" },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  return (
    <div className="mt-2 bg-white flex flex-col border-1 shadow-inner rounded-xl  mx-auto p-3 border-8">
      <div className="flex justify-center items-center  font-tenada ">
        <h1 className="text-2xl">맛집 탐색 중</h1>
        <div>
          <Typewriter text="...." delay={300} infinite />
        </div>
      </div>
      <div className="flex justify-center items-center  font-tenada ">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`relative flex flex-col justify-center items-center w-36 ${
              i !== 0
                ? "before:content-[''] before:bg-slate-200 before:absolute before:w-full before:h-[3px] before:right-1/2 before:top-1/3 before:-translate-y-1/2"
                : ""
            } ${currentStep === i + 1 ? "active" : ""} ${
              i + 1 < currentStep || complete ? "complete" : ""
            }`}
          >
            <div
              onClick={() => setRoomMode(i + 1)}
              className={`w-14 h-14 flex items-center justify-center z-10 relative rounded-full font-semibold text-white ${
                currentStep === i + 1
                  ? "bg-black"
                  : i + 1 < currentStep || complete
                  ? "bg-green-600"
                  : "bg-slate-700"
              }`}
            >
              {i + 1 < currentStep || complete ? (
                <img
                  src={step.image}
                  alt={`Step ${i + 1}`}
                  className="w-14 h-14 rounded-full"
                />
              ) : (
                <img
                  src={step.image}
                  alt={`Step ${i + 1}`}
                  className="w-14 h-14 rounded-full"
                />
              )}
            </div>
            <p
              className={`text-gray-500 mt-1 ${
                i + 1 < currentStep || complete ? "text-white" : ""
              }`}
            >
              {step.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

{
  /* 
      {!complete && (
        <button
          className="btn"
          onClick={() => {
            currentStep === steps.length
              ? setComplete(true)
              : setCurrentStep((prev) => prev + 1);
          }}
        >
          {currentStep === steps.length ? "Finish" : "Next"}
        </button>
      )} */
}

// {(i + 1 < currentStep || complete) && i !== 0 && (
//   <style jsx>{`
//     div:before {
//       background-color: #10b981; /* Tailwind green-600 */
//     }
//   `}</style>
// )}

const MODE = {
  MODE1: 1,
  MODE2: 2,
  MODE3: 3,
  MODE4: 3,
};
