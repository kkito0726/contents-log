import { useEffect, useState } from "react";

const url = "http://localhost:4000";

export const Main = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await (await fetch(`${url}/booklog`)).json();
      setData((prevData) => [...prevData, ...res]);
    })();
  }, []);

  return (
    <div className="mainPage">
      <h1>消費コンテンツメモアプリ</h1>

      <div>
        <ol>
          {data.map((jsonData) => {
            return (
              <li
                key={jsonData.id}
              >{`Title: ${jsonData.title} Comment: ${jsonData.comment}`}</li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
