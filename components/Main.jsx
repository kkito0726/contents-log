import { useEffect, useState } from "react";
import { url } from "../config/access.jsx";

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

  const putDb = async (id, putData) => {
    const res = await fetch(`${url}/booklog/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
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

  const handlePut = async (jsonData) => {
    const title = document.querySelector(`#editTitle${jsonData.id}`).value;
    const comment = document.querySelector(`#editComment${jsonData.id}`).value;
    const putData = {
      title: title,
      comment: comment,
    };
    await putDb(jsonData.id, putData);
    await getDb();
    console.log(`Title=${title} Comment=${comment}`);
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
  const handleBackgroundColor = (jsonData) => {
    const target = document.querySelector(`#content${jsonData.id}`);
    target.style.backgroundColor = "orange";
  };
  const handleEdit = (jsonData) => {
    if (editId.indexOf(jsonData.id) !== -1 && isEdit) return;
    handleBackgroundColor(jsonData);
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
              <div
                key={jsonData.id}
                className="content"
                id={`content${jsonData.id}`}
              >
                <li>{`Title: ${jsonData.title} Comment: ${jsonData.comment}`}</li>
                <button
                  onClick={() => handleDelete(jsonData)}
                  className="deleteButton"
                >
                  削除
                </button>

                {isEdit && editId.indexOf(jsonData.id) !== -1 ? (
                  <div className="edit" id={`edit${jsonData.id}`}>
                    <input
                      type="text"
                      id={`editTitle${jsonData.id}`}
                      placeholder="Titleを入力"
                      //   value={jsonData.title}
                    />
                    <input
                      type="text"
                      id={`editComment${jsonData.id}`}
                      placeholder="Commentを入力"
                      //   value={jsonData.comment}
                    />
                    <button onClick={() => handlePut(jsonData)}>送信</button>
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
