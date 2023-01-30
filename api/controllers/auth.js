import db  from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.execute(q, [req.body.email, req.body.username]).then(([data]) => {
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (username,email,password) VALUES (?,?,?)";
    const values = [req.body.username, req.body.email, hash];
    
    db.execute(q, values).then(([data]) => {
      res.status(200).json("User has been created.");
    }).catch(err => {
      console.log(err);
      res.status(500).json(err)
    });
  }).catch(err => {
    res.status(500).json(err)
  });
}
    


export const login = (req,res)=>{

 const q = "SELECT * FROM users WHERE username = ?";

 db.execute(q, [req.body.username]).then(([data]) => {
   
   if (data.length === 0) return res.status(404).json("User not found!");


   const isPasswordCorrect = bcrypt.compareSync(
     req.body.password,
     data[0].password
   );

   if (!isPasswordCorrect)
     return res.status(400).json("Wrong username or password!");

   const token = jwt.sign({ id: data[0].id }, "jwtkey");
   const { password, ...other } = data[0];

   res
     .cookie("access_token", token, {
       httpOnly: true,
     })
     .status(200)
     .json(other);
 }).catch(err => {
   res.status(500).json(err);
 })
};

export const logout = (req, res) => {
 res.clearCookie("access_token",{
   sameSite:"none",
   secure:true
 }).status(200).json("User has been logged out.")
};
