import { useEffect, useState } from "react";

const url = "http://localhost:4000";

export const Main = () => {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputComment, setInputComment] = useState("");

  const getDb = async () => {
    const res = await (await fetch(`${url}/booklog`)).json();
    console.log(res.status);
    setData([...res]);
  };

  const postDb = async () => {
    const sendData = JSON.stringify({
      title: inputTitle,
      comment: inputComment,
    });
    const res = await fetch(`${url}/booklog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: sendData,
    });
    console.log(sendData);
    console.log(res.status);
  };

  const putDb = async (id) => {
    const res = await fetch(`${url}/booklog/${id}`, {
      method: "PUT",
    });
    console.log(res.status);
  };
  const deleteDb = async (id) => {
    const res = await fetch(`${url}/booklog/${id}`, { method: "DELETE" });
    console.log(res.status);
  };

  useEffect(() => {
    getDb();
  }, []);

  const handleInputTitle = (e) => {
    setInputTitle(e.target.value);
  };

  const handleInputComment = (e) => {
    setInputComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputTitle && inputComment) {
      console.log(`${inputTitle} & ${inputComment}`);
      await postDb();
      await getDb();
    } else {
      alert("入力内容が不十分です");
    }
  };
  const handleDelete = async (jsonData) => {
    const confirmRes = confirm(`${jsonData.title}を削除します`);
    if (confirmRes) {
      console.log(`${url}/booklog/${jsonData.id}`);
      await deleteDb(jsonData.id);
      await getDb();
      console.log(`${jsonData.title}`);
    }
  };
  const handleEdit = (jsonData) => {
    if (editId.indexOf(jsonData.id) !== -1 && isEdit) return;
    setIsEdit((prevIsEdit) => true);
    setEditId((prevEditId) => [...prevEditId, jsonData.id]);

    setInputTitle(jsonData.title);
    setInputComment(jsonData.comment);
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
                  onClick={() => handleDelete(jsonData)}
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
                  <button onClick={() => handleEdit(jsonData)}>編集</button>
                )}
              </div>
            );
          })}
        </ol>
      </div>
      <h2 className="submitTitle">データの追加</h2>

      <div className="submit">
        <div className="title">
          <label htmlFor="">TITLE:</label>
          <input
            type="text"
            placeholder="Titleを入力"
            onChange={handleInputTitle}
          />
        </div>

        <div className="comment">
          <label htmlFor="">COMMENT:</label>
          <textarea
            className="commentBox"
            type="text"
            placeholder="Commentを入力"
            onChange={handleInputComment}
            rows="6"
          />
        </div>

        <button className="submitButton" onClick={handleSubmit}>
          追加
        </button>
      </div>
    </div>
  );
};
