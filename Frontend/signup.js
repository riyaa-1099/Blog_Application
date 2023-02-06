import { back_url } from "./url.js";

// const data = Cookies.get("connect.sid");
// console.log(data);

  document.getElementById("onclicklog").onclick = function () {
    login();
  };
  document.getElementById("forgetPassword").onclick = function () {
   forgetPassword();
  };
  document.getElementById("onclickreg").onclick = function () {
    register();
  };
  document.getElementById("sendotp").onclick = function () {
    sendotp();
  };
  document.getElementById("signgoogle").onclick = function () {
    googleregister();
  };
  document.getElementById("logoutbtn").onclick = function () {
    logout();
  };
  // document.getElementById("signgithub").onclick = function () {
  //   githubregister();
  // };

document.getElementById("forget").style.display="none";


  const register = async () => {
    const reg_formname = document.getElementById("name");
    const reg_formemail = document.getElementById("email");
    const reg_formpassword = document.getElementById("password");
    const reg_formotp = document.getElementById("otp");

    const name = reg_formname.value;
    const email = reg_formemail.value;
    const password = reg_formpassword.value;
    const otp = reg_formotp.value;
   const role=document.getElementById("role").value;
   
    let body = {
      name,
      email,
      password,
      role,
      otp
    };
    const reg_api = `${back_url}/user/signup`;
    const res = await fetch(reg_api, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
     localStorage.setItem("token", data.token);
       localStorage.setItem("refreshToken", data.refreshToken);
    console.log("data",data);
  };

const sendotp=async()=>{

  const reg_formemail = document.getElementById("email");

  const email = reg_formemail.value;

  const api=`${back_url}/getotp`;
  const res=await fetch(api,{
    method:'POST',
    body:JSON.stringify({email}),
    headers: { "Content-Type": "application/json" },

  })
  const data = await res.json();
  
  console.log(data);
}


  const login = async () => {
    const loginemail= document.getElementById("loginemail");
    const loginpassword = document.getElementById("loginpassword");

    const email = loginemail.value;
    const password = loginpassword.value;
    let body = {
      email,
      password,
    };
    const login_api = `${back_url}/user/login`;
    const res = await fetch(login_api, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
   
    //res.cookie("token",(data.token))
  };

  const googleregister = async () => {
    const api = `${back_url}/auth/google`;
    let res = window.open(api);
    console.log(res)
  };

  let token1 = localStorage.getItem("token");
  async function logout() {
    try {
      let res = await fetch(`${back_url}/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token1}`,
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      console.log(data);
    } 
    catch (err) {
      console.log("something wrong");
      console.log(err);
    }
  }

  
  const forgetPassword=()=>{
//sendotp();
document.getElementById("forget").style.display="block";
document.getElementById("login").style.display="none";
document.getElementById("forgetset").onclick = function(){
  forgetset();
};
const forgetset=()=>{

  let email=document.getElementById("forgetemail").value;
  let password=document.getElementById("newpassword").value;
  let otp=document.getElementById("newotp").value;

let body={
  email,
  password,
  otp
}

// const api=`${back_url}`/

}

  }
