import ResultCard from "./ResultCard";
import { useParams } from "react-router-dom";

export const DUMMY_PLACE = [
  {
    id: "item1",
    title: "토니모리",
    imgUrl: "/초밥.png",
  },
  {
    id: "item2",
    title: "역전할맥",
    imgUrl: "/돈까스.png",
  },
  {
    id: "item3",
    title: "교촌치킨",
    imgUrl: "/샤브샤브.png",
  },
  {
    id: "item4",
    title: "할매국밥",
    imgUrl: "/된장찌개.png",
  },
  {
    id: "item5",
    title: "돈까스",
    imgUrl: "/국밥.png",
  },
];

const ResultCardLists = ({ combinedplaceList }) => {
  console.log("ResultCardLists", combinedplaceList);

  return (
    <ul className="flex gap-10 roun">
      <li
        id={DUMMY_PLACE[0].id}
        key={0}
        className="animate-fade animate-ease-in"
        style={{ animationDelay: `${0.5 * 1}s` }}
      >
        <ResultCard
          title={DUMMY_PLACE[0].title}
          imgUrl={DUMMY_PLACE[0].imgUrl}
          id={DUMMY_PLACE[0].id}
        />
      </li>
      <li
        id={DUMMY_PLACE[1].id}
        key={1}
        className="animate-fade animate-ease-in"
        style={{ animationDelay: `${0.5 * 2}s` }}
      >
        <ResultCard
          title={DUMMY_PLACE[1].title}
          imgUrl={DUMMY_PLACE[1].imgUrl}
          id={DUMMY_PLACE[1].id}
        />
      </li>
      <li
        id={DUMMY_PLACE[2].id}
        key={2}
        className="animate-fade animate-ease-in"
        style={{ animationDelay: `${0.5 * 3}s` }}
      >
        <ResultCard
          title={DUMMY_PLACE[2].title}
          imgUrl={DUMMY_PLACE[2].imgUrl}
          id={DUMMY_PLACE[2].id}
        />
      </li>
      <li
        id={DUMMY_PLACE[3].id}
        key={3}
        className="animate-fade animate-ease-in"
        style={{ animationDelay: `${0.5 * 2}s` }}
      >
        <ResultCard
          title={DUMMY_PLACE[3].title}
          imgUrl={DUMMY_PLACE[3].imgUrl}
          id={DUMMY_PLACE[3].id}
        />
      </li>
      <li
        id={DUMMY_PLACE[4].id}
        key={4}
        className="animate-fade animate-ease-in"
        style={{ animationDelay: `${0.5 * 1}s` }}
      >
        <ResultCard
          title={DUMMY_PLACE[4].title}
          imgUrl={DUMMY_PLACE[4].imgUrl}
          id={DUMMY_PLACE[4].id}
        />
      </li>
    </ul>
  );
};

export default ResultCardLists;
