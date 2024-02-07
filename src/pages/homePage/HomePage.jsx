import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigator = useNavigate();
  const handleClick = () => {
    navigator("/login");
  };
  return (
    <div className="bg-[url('/BackGroundImg_2.jpg')] min-h-screen text-gray-900 flex items-center justify-center">
      <div className="m-20 h-full p-6 bg-white opacity-70 shadow-lg rounded-lg flex justify-center animate-fade-up items-center">
        <div className="mt-2 flex flex-col items-center">
          <h1 className="font-bold text-2xl"></h1>
          <img
            className="mt-2 rounded-xl w-[320px] h-[200px] object-cover"
            src="./BackGroundImg_3.png"
            alt=""
          />
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs">
              <button
                onClick={handleClick}
                className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <span className="">시작하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
