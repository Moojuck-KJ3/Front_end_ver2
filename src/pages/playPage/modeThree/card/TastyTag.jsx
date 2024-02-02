import React from 'react';


const TastyTag = () => {
  return (
    <ul className="flex justify-center flex-wrap max-w-xl align-center gap-2 leading-8">
      <li>
        <a
          href="#"
          className="px-2 py-1 relative bg-gray-100 rounded-lg select-none hover:shadow hover:shadow-teal-500 hover:outline hover:outline-teal-600 text-cyan-500 text-3xl"
        >
          #일식
        </a>
      </li>
      <li>
        <a
          href="#"
          className="px-2 py-1 relative bg-gray-100 rounded-lg select-none hover:shadow hover:shadow-teal-500 hover:outline hover:outline-teal-600 text-cyan-500 text-xl text-teal-500"
        >
          #일식당
        </a>
      </li>
      <li>
        <a
          href="#"
          className="px-2 py-1 relative bg-gray-100 rounded-lg select-none hover:shadow hover:shadow-teal-500 hover:outline hover:outline-teal-600 text-cyan-500  text-md text-red-500"
        >
          #인스타 감성의
        </a>
      </li>
      <li>
        <a
          href="#"
          className="px-2 py-1 relative bg-gray-100 rounded-lg select-none hover:shadow hover:shadow-teal-500 hover:outline hover:outline-teal-600 text-cyan-500 text-lg text-green-500"
        >
          #이야기 하기 좋은
        </a>
      </li>
      <li>
        <a
          href="#"
          className="px-2 py-1 relative bg-gray-100 rounded-lg select-none hover:shadow hover:shadow-teal-500 hover:outline hover:outline-teal-600 text-cyan-500 text-sm text-orange-500"
        >
          #방이 있는
        </a>
      </li>
      <li>
        <a
          href="#"
          className="px-2 py-1 relative bg-gray-100 rounded-lg select-none hover:shadow hover:shadow-teal-500 hover:outline hover:outline-teal-600 text-cyan-500 text-3xl text-cyan-500"
        >
          #사진이 잘 나오는
        </a>
      </li>
    </ul>
  );
};

export default TastyTag;
