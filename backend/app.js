const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const port = 4000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Example_db01",
  database: "booklog",
  stringifyObjects: true, // SQLインジェクション対策
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("sever");
  res.json({ appTitle: booklog });
});

// データベースの情報を取得
app.get("/booklog", (req, res) => {
  res.set({ "Access-Control-Allow-Origin": "*" });
  connection.query(
    "SELECT * FROM booklog WHERE deleted_at IS NULL",
    (err, response) => {
      if (err) throw err;
      res.json(response);
    }
  );
});

// レコードを追加
app.post("/booklog", (req, res) => {
  res.set({ "Access-Control-Allow-Origin": "*" });
  const bookLog = {
    title: req.body.title,
    comment: req.body.comment,
  };

  // 例外処理
  if (!(bookLog.title && bookLog.comment)) {
    return res.json({
      ok: false,
      error: "invalid parameter",
    });
  }

  // const q = "insert into booklog SET ?"; この書き方だとSQLインジェクションができてしまう
  const q = "INSERT INTO booklog (title, comment) VALUE (?, ?)";
  connection.query(q, [bookLog.title, bookLog.comment], (err) => {
    if (err) throw err;
  });

  res.send("Add record to Table");
});

// 既存のレコードを更新
app.put("/booklog/:id", (req, res) => {
  const id = req.params.id;
  // 例外処理
  if (!(req.body.title && req.body.comment)) {
    return res.json({
      ok: false,
      error: "invalid parameter",
    });
  }
  const bookLog = {
    title: req.body.title,
    comment: req.body.comment,
  };

  const q = `UPDATE booklog SET title=?, comment=? WHERE id=? AND deleted_at IS NULL`;
  connection.query(q, [bookLog.title, bookLog.comment, id], (err) => {
    if (err) throw err;
  });

  res.send(`updated id = ${id}`);
});

//レコードの削除
app.delete("/booklog/:id", (req, res) => {
  const str_idx = String(req.params.id);

  const q = "UPDATE booklog SET deleted_at=? WHERE id=?";
  connection.query(q, [new Date(), str_idx], (err) => {
    if (err) throw err;
  });

  res.send(`Deleted id = ${str_idx}`);
});

app.use(cors);
app.listen(port, () => {
  console.log("sever started");
});
