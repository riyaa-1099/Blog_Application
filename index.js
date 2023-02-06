const express = require("express");
const cors = require("cors");
const Redis = require('ioredis');
const passport = require("./Backend/middleware/googleAuth");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const redis = new Redis({
  host: process.env.redishost,
  port: process.env.redisport,
  password: process.env.redispassword,
  username: process.env.redisusername
});
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(cookieParser());
const session = require('express-session');

// const redirectUrl = new URL(window.location.href).searchParams.get("redirect");

// if (redirectUrl) {
//     window.location.href = redirectUrl;
// }
const  authentication  = require("./Backend/middleware/authentication");
const { connection } = require("./Backend/config/db");
const { userRouter } = require("./Backend/routes/user.route");
const { todoRouter } = require("./Backend/routes/blog.route");
const { adminRouter } = require("./Backend/routes/admin.route");
const { otpRouter } = require("./Backend/routes/otp.route");
const { commentRouter } = require("./Backend/routes/comment.route");
const { likesRouter } = require("./Backend/routes/like.route");


app.get("/", (req, res) => {
  res.send({ msg: "Welcome" });
});

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));


app.get("/auth/github", async (req, res) => {
  const { code } = req.query;
  //console.log("code "+code)
 let accessToken = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        code,
      }),
    }
  ).then((res) => res.json());

  //console.log(accessToken)
let userDetails = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken.access_token}`,
    },
  })
  userDetails=await userDetails.json();
    // .then((res) => res.json())
    // .catch((err) => {
    //   console.log(err);
    // });
  console.log("user",userDetails)
  res.redirect("http://localhost:5500/frontend/index.html");
});


app.get( "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);


app.get( "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    //  successRedirect: '/auth/google/success',
    failureRedirect: "/login",
  }),
  function (req, res) {
   
    //console.log("req.user",req.user.token)
    res.cookie("token",(req.user.token))
    res.cookie("refreshToken",(req.user.refreshToken))
    // req.session.data = {
    //   token:req.user.token,
    //   refreshToken:req.user.refreshToken
    // };
    res.redirect(`/success?redirect=http://localhost:5500/frontend/note.html?token=${accessToken}`);

  }
);

app.get('/logout', async (req, res) => {
  // Log out the user
  const token=req.cookies?.token||req.headers?.authorization?.split(" ")[1];
  await redis.sadd('blacklisted', token);
  res.send({"msg":"logged out successfully"});
});

app.use("/user", userRouter);
app.use("/getotp", otpRouter);
app.use(authentication);

app.use("/blog", todoRouter);
app.use("/admin", adminRouter);
app.use("/comment", commentRouter);
app.use("/likes", likesRouter);



app.listen(7000, async () => {
  try {
    await connection;
    console.log("Connected to db successfully");
    console.log("Listening on port 7000");
  } catch (err) {
    console.log(err);
    console.log("Connection failed to db");
  }
});
