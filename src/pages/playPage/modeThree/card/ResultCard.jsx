import React, { useEffect, useState } from "react";

const ResultCard = ({ title, imgUrl }) => {
  return (
    <div
      className={`w-[160px] h-[180px] bg-transparent cursor-pointer group perspective`}
    >
      <div className="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-1000">
        <div className="absolute bg-white text-black  shadow-xl backface-hidden w-full h-full">
          <img src={imgUrl} className="w-full h-full rounded-lg" />
        </div>
        <div className="absolute my-rotate-y-180 backface-hidden w-full h-full bg-white shadow-xl overflow-hidden">
          <div className="text-center flex flex-col items-center h-full text-gray-800 px-2">
            <div className="my-4 gap-1 flex flex-col w-full p-3">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-600">가게 이름</h3>
                <p className=" text-black text-sm">{title}</p>
              </div>
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                  방문자 리뷰
                </h3>
                <p className="text-black text-sm ">1,402</p>
              </div>
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                  블로그 리뷰
                </h3>
                <p className="text-black text-sm">1,602</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm">리뷰수</p>
                <p className="text-sm"> ⭐️4.5</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm">영업중</p>
                <p className="text-sm">21:00까지</p>
              </div>
            </div>
            <button className="bg-teal-500 px-4 py-2 text-xs font-semibold text-white rounded-full absolute -bottom-20 delay-500 duration-1000 group-hover:bottom-1 scale-0 group-hover:scale-105">
              선택하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
