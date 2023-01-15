import { useEffect, useState } from "react";
import { url } from "../config/access.jsx";
import { v4 as uuidv4 } from "uuid";

export const Main = () => {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputComment, setInputComment] = useState("");
  const [category, setCategory] = useState("");

  const getDb = async () => {
    const res = await (await fetch(`${url}/booklog`)).json();
    setData([...res]);
  };

  const postDb = async () => {
    const sendData = JSON.stringify({
      title: inputTitle,
      category: category,
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
    const category = document.querySelector(
      `#editCategory${jsonData.id}`
    ).value;
    console.log(category);
    const putData = {
      title: title,
      comment: comment,
      category: category,
    };
    await putDb(jsonData.id, putData);
    await getDb();
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
    // if (isEdit) {
    //   target.style.backgroundColor = "aliceblue";
    //   return;
    // }
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
    // handleBackgroundColor();
    setEditId((prevEditId) => prevEditId.filter((num) => num !== id));
    if (editId.length == 0) {
      setIsEdit((prevIsEdit) => false);
    }
    console.log(editId);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    console.log(category);
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
                <li>{`Title: ${jsonData.title} Category: ${jsonData.category} Comment: ${jsonData.comment}`}</li>
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
                    <div className="category">
                      <label htmlFor="">CATEGORY: </label>
                      <select name="" id={`editCategory${jsonData.id}`}>
                        <option value="magazine" key={uuidv4()}>
                          マンガ
                        </option>
                        <option value="game" key={uuidv4()}>
                          ゲーム
                        </option>
                        <option value="programming" key={uuidv4()}>
                          プログラミング
                        </option>
                      </select>
                    </div>
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

        <div className="category">
          <label htmlFor="">CATEGORY: </label>
          <select name="" id="" onChange={handleCategory}>
            <option value="magazine" key={uuidv4()}>
              マンガ
            </option>
            <option value="game" key={uuidv4()}>
              ゲーム
            </option>
            <option value="programming" key={uuidv4()}>
              プログラミング
            </option>
          </select>
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
