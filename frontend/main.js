const instance = axios.create({
  baseURL: "http://localhost:3000",
});

const prds = document.querySelector(".prds");
const pagebox = document.querySelector(".pagebox");
let btn = document.querySelector(".btn");
let btn_prev = document.querySelector(".btn_prev");

let page = 1;

async function getProds(urlpage) {
  let { data } = await instance.get(urlpage);

  if (data.length == 0) {
    page--;
    return;
  }

  prds.innerHTML = "";
  data.forEach((e) => {
    prds.insertAdjacentHTML(
      "beforeend",
      `
          <div class="card">
          <h3>${e.name}</h3>
          <p>${e.brand}</p>
          <h2>$${e.price}</h2>
          </div>`
    );
  });
  pagebox.innerHTML = "";
  pagebox.insertAdjacentHTML("beforeend", `page:${page}`);
}

btn_prev.addEventListener("click", async (e) => {
  e.preventDefault();
  if (page > 1) {
    page--;
    getProds(`/products?page=${page}`);
  }
});

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  page++;
  getProds(`/products?page=${page}`);
});

getProds("/products?page=1");
