import db from "../db.js";
import jwt from "jsonwebtoken";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;

  db.execute(q, [req.params.postId]).then(([data]) => {
    if (data) return res.status(500).json(data);
  }).catch(err => {
    res.status(200).json(err);
  })
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO comments(description, date, uid, postId) VALUES (?,?,?,?);"

    const values = [
      req.body.description,
      req.body.date,
      userInfo.id,
      req.body.postId
    ];

    db.execute(q,values).then (() => {
    res.status(200).json("Comment has been created.");
    }).catch(err => {
      res.status(500).json(err)
    })
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND `uid` = ?";

    db.execute(q, [commentId, userInfo.id]).then (([data]) => {
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    }).catch(err => {
      res.status(500).json(err);
    })
  });
};