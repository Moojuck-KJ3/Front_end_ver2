import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputWithLabel from "../../components/InputWithLable";
import { login } from "../../api";

const LoginPage = () => {
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // TOOD 로그인 관련 로직 여기에 추가
    const userDetails = {
      email,
      password,
    };

    const response = await login(userDetails);
    if (!response.error) {
      localStorage.setItem("user", JSON.stringify(response));
      navigator("/entry");
    } else {
      console.log(response);
    }
  };
  return (
    <div className="bg-[url('/BackGroundImg_2.jpg')] min-h-screen text-gray-900 flex justify-center items-center">
      <div className=" p-8 bg-white shadow-lg rounded-lg flex justify-center animate-fade-up">
        <div className="w-full mt-5 flex flex-col items-center">
          <h1 className="font-bold text-2xl font-[Tenada]">로그인</h1>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs">
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
                  onClick={handleLogin}
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <span className="font-[Tenada]">로그인</span>
                </button>
                <div className="font-[Tenada] border-b text-center">
                  <div className=" leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    아직 회원이 아니신가요?
                    <a
                      className=" text-blue-600 hover:text-blue-800 ml-1"
                      href="/register
                        "
                    >
                      회원가입
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

export default LoginPage;

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
