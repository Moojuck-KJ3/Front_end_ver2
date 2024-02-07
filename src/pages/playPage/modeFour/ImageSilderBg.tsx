import React, { useState, useEffect } from "react";
//import { getResult } from "../../../api";
import { useParams } from "react-router-dom";

const ImageSilderBg = () => {
  // const [pickRest, setPickRests] = useState(null);
  // const roomId = useParams();

  // useEffect(() => {
  //   // 중요한 결과이므로, 최대 재시도 횟수를 정해두고, 그 횟수만큼 재시도시킨다
  //   const maxRetries = 3;
  //   let retryCount = 0;

  //   const getResultData = async (roomId) => {
  //     const retry = async () => {
  //       const result = await getResult(roomId);

  //       if (result.error) {
  //         console.log(result.error);

  //         // 재시도 횟수가 최대 재시도 횟수보다 작은 경우에만 재시도
  //         if (retryCount < maxRetries) {
  //           retryCount++;
  //           console.log(`Retrying... (${retryCount}/${maxRetries})`);

  //           // 1초 후에 재시도
  //           setTimeout(retry, 1000);
  //         }
  //       } else {
  //         setPickRests(result);
  //       }
  //     };

  //     retry();
  //   };

  //   getResultData(roomId);
  // }, []);

  return (
    <div className="flex flex-col h-full w-full px-20 justify-center rounded-xl scale-90">
      <div className="flex justify-between">
        <h3 className="text-2xl my-4 font-bold ">
          강남역 OOO 카페
        </h3>
      </div>
      <div className="grid grid-cols-5 gap-2">
        <img
          src="./국밥.png"
          className="w-52 shadow-md overflow-hidden mt-2 bg-gray-300 shrink-0 object-fit rounded-xl"
        />
        <img
          src="./국밥.png"
          className="w-52 shadow-md overflow-hidden mt-2 bg-gray-300 shrink-0 object-fit rounded-xl"
        />
        <img
          src="./국밥.png"
          className="w-52 shadow-md overflow-hidden mt-2 bg-gray-300 shrink-0 object-fit rounded-xl"
        />
        <img
          src="./국밥.png"
          className="w-52 shadow-md overflow-hidden mt-2 bg-gray-300 shrink-0 object-fit rounded-xl"
        />
        <img
          src="./국밥.png"
          className="w-52 shadow-md overflow-hidden mt-2 bg-gray-300 shrink-0 object-fit rounded-xl"
        />
      </div>
      <div className="my-5 flex flex-1">
        <div className="flex justify-between">
          <h3 className="text-base font-bold text-gray-600">방문자 리뷰</h3>
          <p className="ml-2 text-black">1,402</p>
          <div>﹒</div>
        </div>

        <div className="flex justify-between">
          <h3 className="text-base font-bold text-gray-600">블로그 리뷰</h3>
          <p className="ml-2 text-black">1,402</p>
          <div>﹒</div>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 font-bold text-base">리뷰수</p>
          <p className="ml-2"> ⭐️4.5</p>
          <div>﹒</div>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 font-bold text-base">영업중</p>
          <p className="ml-2"> 21:00 영업 종료</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* 리뷰 보기 */}
        <div className="flex flex-col shadow-xl m-2 p-2">
          <div className="flex justify-between items-center">
            <h1 className="text-gray-700 font-semibold text-lg">
              평가 및 리뷰
            </h1>
            <button className=" bg-white hover:bg-gray-100 text-gray-800 font-medium border rounded-xl text-sm py-1 px-4 shadow-lg">
              리뷰 더보기
            </button>
          </div>
          <div className="py-2 gap-1 flex flex-col">
            <div className="flex items-center">
              <p className="text-2xl p-1 m01"> 4.5</p>
              <p className="ml-2">⭐️⭐️⭐️⭐️</p>
            </div>
            <ul className="">
              <li className=" my-2 flex items-center py-1 px-6  border rounded-lg cursor-pointer">
                <img
                  className="w-8 h-8 rounded-lg object-cover mr-4"
                  src="./avatar.png"
                  alt="PlacePhoto"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">마리오</h3>
                  <p className="text-base">
                    재료가 너무 신선하고 음식 맛도 좋네요!! 강추요~
                  </p>
                </div>
              </li>
              <li className="my-2 flex items-center py-4 px-6  border rounded-lg cursor-pointer">
                <img
                  className="w-12 h-12 rounded-lg object-cover mr-4"
                  src="./avatar.png"
                  alt="PlacePhoto"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">마리오</h3>
                  <p className=" text-base">
                    재료가 너무 신선하고 음식 맛도 좋네요!! 강추요~
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* 상세 정보 */}
        <div className="flex flex-col shadow-xl m-2 p-2">
          <div className="flex justify-between items-center">
            <h1 className="text-gray-700 font-semibold text-lg">상세 정보</h1>
            <button className=" bg-white hover:bg-gray-100 text-gray-800 font-medium border rounded-xl text-sm py-1 px-4 shadow-lg">
              더보기
            </button>
          </div>
          <div className="py-2 gap-5 flex flex-col">
            <div>
              <h1 className=" font-bold">요리</h1>
              <p className="my-1">닭갈비, 한식</p>
            </div>
            <div>
              <h1 className=" font-bold">식사 시간</h1>
              <p className="my-1">점심식사, 저녁 식사</p>
            </div>
          </div>
        </div>
        {/* 블로그 리뷰 */}
        <div className="flex flex-col shadow-xl m-2 p-2">
          <div className="flex">
            <h1 className="text-gray-700 font-semibold text-lg">블로그 리뷰</h1>
          </div>
          <div className="py-1 gap-1 flex flex-col">
            <ul className="">
              <li className="my-2 flex py-4 px-4 border rounded-lg justify-between">
                <div className="flex-col pr-8">
                  <h3 className="text-lg font-medium text-gray-800">
                    강남역 OO집 후기
                  </h3>
                  <p className="text-gray-600 text-base">좋네요~~</p>
                </div>
                <img
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                  src="./PlacePhoto.png"
                  alt="PlacePhoto"
                />
              </li>
              <li className="my-2 flex py-4 px-4 border rounded-lg justify-between">
                <div className="flex-col pr-8">
                  <h3 className="text-lg font-medium text-gray-800">
                    강남역 OO집 후기
                  </h3>
                  <p className="text-gray-600 text-base">좋네요~~</p>
                </div>
                <img
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                  src="./PlacePhoto.png"
                  alt="PlacePhoto"
                />
              </li>
            </ul>
          </div>
        </div>
        {/* 지도 */}
        <div className="flex flex-col shadow-xl m-2 p-2">
          <div className="flex justify-between items-center">
            <h1 className="text-gray-700 font-semibold text-lg p-1">
              위치 정보
            </h1>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11672.945750644447!2d126.9779692!3d37.566535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca1bda76a4b5b%3A0xf85c4e4618c2edc!2sSeoul%2C%20South%20Korea!5e0!3m2!1sen!2sus!4v1619524992238!5m2!1sen!2sus"
            width="100%"
            height="200"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          <div className="flex py-2">
            <button className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className=" hover:text-blue-600">강남역 3번 출구 앞 300m</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSilderBg;
