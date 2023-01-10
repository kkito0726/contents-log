import { useEffect, useState } from "react";

const url = "http://localhost:4000";

export const Main = () => {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState([]);

  const getDb = async () => {
    const res = await (await fetch(`${url}/booklog`)).json();
    console.log(res.status);
    setData([...res]);
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

  const handleEdit = (id) => {
    if (editId.indexOf(id) !== -1 && isEdit) return;
    setIsEdit((prevIsEdit) => true);
    setEditId((prevEditId) => [...prevEditId, id]);
    console.log(editId);
  };

  const handleCancel = (id) => {
    setEditId((prevEditId) => prevEditId.filter((num) => num !== id));
    if (editId.length == 0) {
      setIsEdit((prevIsEdit) => false);
    }
    console.log(editId);
  };

  return (
    <div className="mainPage">
      <h1>消費コンテンツメモアプリ</h1>

      <div className="contents">
        <ol>
          {data.map((jsonData) => {
            return (
              <div key={jsonData.id} className="content">
                <li>{`Title: ${jsonData.title} Comment: ${jsonData.comment}`}</li>
                <button
                  onClick={() => deleteDb(jsonData.id)}
                  className="deleteButton"
                >
                  削除
                </button>

                {isEdit && editId.indexOf(jsonData.id) !== -1 ? (
                  <div className="edit">
                    <input type="text" value={jsonData.title} />
                    <input type="text" value={jsonData.comment} />
                    <button>送信</button>
                    <button onClick={() => handleCancel(jsonData.id)}>
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(jsonData.id)}>編集</button>
                )}
              </div>
            );
          })}
        </ol>
      </div>

      <div>
        <label htmlFor="">
          TITLE:
          <input type="text" placeholder="Titleを入力" />
        </label>
        <label htmlFor="">
          COMMENT:
          <input type="text" placeholder="Commentを入力" />
        </label>
      </div>
    </div>
  );
};
