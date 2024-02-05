const TagCard = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-all p-4 w-full border-2 border-gray-200 animate-fade">
      <h1 className=" text-base font-bold text-center ">{data}</h1>
    </div>
  );
};

export default TagCard;
