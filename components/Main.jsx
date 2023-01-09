import { useEffect, useState } from "react";

const url = "http://localhost:4000";

export const Main = () => {
  const [data, setData] = useState([]);
  const getDb = async () => {
      const res = await (await fetch(`${url}/booklog`)).json();
    console.log(res.status);
      setData((prevData) => [...prevData, ...res]);
  };

  const deleteDb = async (id) => {
    console.log(`${url}/booklog/${id}`);
    const res = await fetch(`${url}/booklog/${id}`, {
      method: "DELETE",
    });
    console.log(`${res.status}: レコードを削除しました`);
    // setData([]);
    setData((prevData) => [...prevData, ...res]);
  };

  useEffect(() => {
    getDb();
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
