 import express from "express";
 import authRoutes from "./routes/auth.js"
 import userRoutes from "./routes/users.js"
 import postRoutes from "./routes/posts.js"
 import commentRoutes from "./routes/comments.js";
 import cookieParser from "cookie-parser";
 import dotenv from "dotenv";
 import multer from "multer";

 const app = express()
 app.use(express.json())
 app.use(cookieParser())
 
 dotenv.config()

 const storage = multer.diskStorage({
   destination: function (req, file, cd){
     cd(null, '../client/public/upload')
   },
   filename: function (req, file, cd){
     cd(null, Date.now() + file.originalname)
   }
 })

 const upload = multer({ storage })

 app.post('/api/upload', upload.single('file'), function (req, res) {
   const file = req.file;
  res.status(200).json(file.filename)
 })

 app.use("/api/auth", authRoutes);
 app.use("/api/users", userRoutes);
 app.use("/api/posts", postRoutes);
 app.use("/api/comments", commentRoutes);
 
 
 app.listen(8800, () => {
   console.log("Connected!");
 });