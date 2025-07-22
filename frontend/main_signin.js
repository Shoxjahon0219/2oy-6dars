const api = axios.create({
  baseURL: "http://localhost:3000",
});

let name_inp = document.querySelector(".name");
let password_inp = document.querySelector(".password");

let btn = document.querySelector(".btn");

async function createData(obj) {
  await api.post("/users/register", obj);
}

async function isNameReturn(check_name) {
  let { data } = await api.get("/users");

  return data.some((obj) => obj.name == check_name);
}

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (name_inp.value && password_inp.value) {
    let gg = await isNameReturn(name_inp.value);

    if (password_inp.value.length < 8) {
      alert("Error: password must be at least 8 characters ");
      return;
    }
    if (!gg) {
      createData({
        name: name_inp.value,
        password: password_inp.value,
      });
      window.location.assign("./index.html");
    } else {
      alert("Error: Try another login");
    }
  } else {
    alert("Error: Fill in all fields");
  }
});
