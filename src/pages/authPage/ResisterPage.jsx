import React, { useState } from "react";
import InputWithLabel from "../../components/InputWithLable";
import { useNavigate } from "react-router-dom";
import { register } from "../../api";

const ResisterPage = () => {
  const navigator = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    // TOOD 회원가입 관련 로직 여기에 추가
    const userDetails = {
      username,
      email,
      password,
    };

    const response = await register(userDetails);
    if (!response.error) {
      localStorage.setItem("user", JSON.stringify(response));
      navigator("/entry");
    } else {
      console.log(response);
    }
  };

  return (
    <div className="bg-[url('/BackGroundImg_2.jpg')] min-h-screen text-gray-900 flex justify-center items-center">
      <div className="m-20 p-6 bg-white shadow-lg rounded-lg flex justify-center animate-fade-up">
        <div className="mt-5 flex flex-col items-center">
          <h1 className="font-bold text-2xl font-[Tenada]">회원가입</h1>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs">
              <InputWithLabel
                type="username"
                value={username}
                setValue={setUsername}
                placeholder={"이름"}
              />
              <InputWithLabel
                type="email"
                value={email}
                setValue={setEmail}
                placeholder={"이메일"}
              />
              <InputWithLabel
                type="password"
                value={password}
                setValue={setPassword}
                placeholder={"비밀번호"}
              />
              <div>
                <button
                  onClick={handleRegister}
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <span className="font-[Tenada]">회원가입</span>
                </button>
                <div className="border-b text-center">
                  <div className="font-[Tenada] leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    아직 회원이 아니신가요?
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

export default ResisterPage;

{
  /* <div className="flex-1 bg-indigo-100 text-center hidden rounded-r-lg lg:flex">
<div
  className=" m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('./LoginImg.png')",
  }}
></div>
</div> */
}
