import React from "react";

const HomePage = () => {
  return (
    <div className=" min-h-screen text-gray-900 flex justify-center">
      <div className="m-20  max-w-screen-xl sm-m-10 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1 animate-fade-up">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-5 flex flex-col items-center">
            <h1 className="font-bold text-2xl">HOME</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <div>
                  <div className="border-b text-center">
                    <a
                      className=" text-blue-600 hover:text-blue-800 ml-1"
                      href="/login
                        "
                    >
                      로그인
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
