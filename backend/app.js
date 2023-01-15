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
app.use(cors());

app.get("/", (req, res) => {
  res.send("sever");
  res.json({ appTitle: booklog });
});

// データベースの情報を取得
app.get("/booklog", (req, res) => {
  connection.query(
    "SELECT * FROM booklog WHERE deleted_at IS NULL",
    (err, response) => {
      if (err) throw err;
      res.json(response);
    }
  );
});

// データのカテゴリーを取得
app.get("/category", (req, res) => {
  connection.query(
    "SELECT category FROM booklog GROUP BY category",
    (err, response) => {
      if (err) throw err;
      res.json(response);
    }
  );
});

// マンガのみを取得
app.get("/magazine", (req, res) => {
  connection.query(
    'SELECT * FROM booklog WHERE category = "magazine"',
    (err, response) => {
      if (err) throw err;
      res.json(response);
    }
  );
});

// ゲームのみを追加
app.get("/game", (req, res) => {
  connection.query(
    'SELECT * FROM booklog WHERE category = "game"',
    (err, response) => {
      if (err) throw err;
      res.json(response);
    }
  );
});

// プログラミングのみを追加
app.get("/programming", (req, res) => {
  connection.query(
    'SELECT * FROM booklog WHERE category = "programming"',
    (err, response) => {
      if (err) throw err;
      res.json(response);
    }
  );
});
// レコードを追加
app.post("/booklog", (req, res) => {
  const bookLog = {
    title: req.body.title,
    comment: req.body.comment,
    category: req.body.category,
  };

  // 例外処理
  if (!(bookLog.title && bookLog.comment && bookLog.category)) {
    return res.json({
      ok: false,
      error: "invalid parameter",
    });
  }

  // const q = "insert into booklog SET ?"; この書き方だとSQLインジェクションができてしまう
  const q = "INSERT INTO booklog (title, category, comment) VALUE (?, ?, ?)";
  connection.query(
    q,
    [bookLog.title, bookLog.category, bookLog.comment],
    (err) => {
      if (err) throw err;
    }
  );

  res.send("Add record to Table");
});

// 既存のレコードを更新
app.put("/booklog/:id", (req, res) => {
  const id = req.params.id;
  // 例外処理
  if (!(req.body.title && req.body.comment && req.body.category)) {
    return res.json({
      ok: false,
      error: "invalid parameter",
    });
  }
  const bookLog = {
    title: req.body.title,
    category: req.body.category,
    comment: req.body.comment,
  };

  const q = `UPDATE booklog SET title=?, category=?, comment=? WHERE id=? AND deleted_at IS NULL`;
  connection.query(
    q,
    [bookLog.title, bookLog.category, bookLog.comment, id],
    (err) => {
      if (err) throw err;
    }
  );

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

app.listen(port, () => {
  console.log("sever started");
});
