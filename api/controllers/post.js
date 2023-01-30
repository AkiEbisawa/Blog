import  db  from "../db.js"
import jwt from "jsonwebtoken";

export const getPosts = (req,res)=>{
  const q = req.body.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts"

  db.query(q).then(([data]) => {
    // console.log(data)
    res.status(200).json(data)
  }).catch(err => {
    res.status(500).send(err);
  })
}

export const getPost = (req,res)=>{
  const q = "SELECT p.id, `username`, `title`, `description`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?"

  db.execute(q,[req.params.id]).then (([data]) => {
    if(data) return res.status(200).json(data[0])
  }).catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
};


export const addPost = (req,res)=>{
  const token = req.cookies.access_token;
  if(!token) return res.status(401).json("");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if(err) return res.status(403).json("")

    
    const q = "INSERT INTO posts (title, description, img, cat, date, uid) VALUES (?,?,?,?,?,?);"
    
    const values = [
      req.body.title,
      req.body.description,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id
    ]
    
    db.execute(q,values).then(() => {
      console.log(req.body, userInfo.id)
      res.json("Post has been created")
    }).catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  });
};


export const deletePost = (req,res)=>{
  const token = req.cookies.access_token
  if(!token) return res.status(401).json("Not authenticated :(")

  jwt.verify(token,"jwtkey", (err, userInfo) => {
    console.log(">>>>",userInfo)
    if(err) return res.status(403).json("Your Token is not valid...")

    const postId = req.params.id

    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?"

    db.execute(q,[postId,userInfo.id]).then(([data]) =>{
      res.json("Post has been deleted")
    }).catch(err => {
      res.status(403).json("You can only delete your own poat!");
    })
  });
};


export const updatePost = (req,res)=>{
  const token = req.cookies.access_token;
  if(!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if(err) return res.status(403).json("Token is not valid")
    
    const postId = req.params.id

    const q = "UPDATE posts SET `title`=?, `description`=?, `img`=?, `cat`=? WHERE `id` = ? AND `uid` = ? ";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      postId, 
      userInfo.id
    ];
    
    db.execute(q, values).then(([data]) => { res.json("Post has been updated")
    }).catch(err => {
      res.status(500).json(err);
    })
  });
};
