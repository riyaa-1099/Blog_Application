import { back_url } from "./url.js";

let token1 =localStorage.getItem("token");
if(token1){
  opennote();
}
else{
console.log("login please")
}
document.getElementById("creating").onclick = function () {
  create();
};

const create = async() => {
  const create_blog = document.getElementById("create");

  const blogtitle = create_blog.logintitle.value;
  const content = create_blog.logincontent.value;
  // const tag = create_form.logintag.value;
  let body = {
    blogtitle,
   content,
   comments:1,
   likes:1,
   userID:req.body.userID
  };
  const create_api = `${back_url}/blog/post`;
  const res = await fetch(create_api, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token1}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data);

  opennote();
};

async function opennote() {
  try {
    let res = await fetch(`${back_url}/blog`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token1}`,
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    console.log(data.Notes);
    appendData(data.Notes);
  } catch (err) {
    console.log("something wrong");
    console.log(err);
  }
}

function appendData(data) {
  let data_div = document.getElementById("notes");
  data_div.innerHTML = null;
  data.forEach(function (element) {
    let div = document.createElement("div");

    let p = document.createElement("input");
    p.value = element.blogtitle;

    let p2 = document.createElement("input");
    p2.value = element.content;

    // let p3 = document.createElement("input");
    // p3.value = element.tag;

    let btn1 = document.createElement("button");
    btn1.innerHTML = "Update";

    btn1.onclick = async function () {
      let body = {
        taskname: p.value,
        status: p2.value,
        tag: p3.value,
      };
      console.log(body);

      try {
        let res = await fetch(`${back_url}/blog/patch/${element._id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${token1}`,
            "Content-Type": "application/json",
          },
        });
        let data = await res.json();
        console.log(data);
        opennote();
      } catch (err) {
        console.log(err);
      }
    };

    let btn2 = document.createElement("button");
    btn2.innerHTML = "Delete";
    btn2.onclick = async function () {
      let res = await fetch(`${back_url}/blog/delete/${element._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      });
      let data = await res.json();
      opennote();
      console.log(data);
    };

    div.append(p, p2, p3, btn1, btn2);
    data_div.append(div);
  });
}
