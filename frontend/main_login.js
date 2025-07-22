const api = axios.create({
  baseURL: "http://localhost:3000",
});

let name_inp = document.querySelector(".name");
let password_inp = document.querySelector(".password");

let btn = document.querySelector(".btn");

function login(obj) {
  return api.post("/users/login", obj);
}

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (name_inp.value && password_inp.value) {
    login({
      name: name_inp.value,
      password: password_inp.value,
    })
      .then((res) => {
        if (res.status == 200) {
          alert(res.data);
          window.location.assign("./index.html");
        }
      })
      .catch((err) => {
        if (err.response?.status == 401) {
          alert(err.response.data);
        }
      });
  } else {
    alert("Error: Fill in all fields");
  }
});
