import Typewriter from "../../components/type/TypeWriter";

export function Header({ roomMode }) {
  let headerContent;

  switch (roomMode) {
    case MODE.MODE1:
      headerContent = "맛집 탐색 중";
      break;
    case MODE.MODE2:
      headerContent = "식당 분위기 선택 중";
      break;
    case MODE.MODE3:
      headerContent = "친구와 교집합 찾는 중";
      break;
    case MODE.MODE4:
      headerContent = "최종 결과 확인";
      break;
    default :
    headerContent = "끝"
  }

  return (
    <div className="mt-2 w-1/3 bg-white flex flex-col border-1 shadow-inner rounded-xl  mx-auto p-3 border-8">
      <div className="flex justify-center items-center  font-tenada ">
        <h1 className=" text-4xl">{headerContent}</h1>
        <div>
          <Typewriter text="...." delay={300} infinite />
        </div>
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
  MODE4: 4,
};
