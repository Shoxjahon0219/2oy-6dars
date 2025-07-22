const express = require("express");
const fs = require("fs");
const { join } = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let data = fs.readFileSync(
  join(__dirname, "database", "products.json"),
  "utf8"
);
data = JSON.parse(data);

let dataUsers = fs.readFileSync(
  join(__dirname, "database", "dataUsers.json"),
  "utf8"
);
dataUsers = JSON.parse(dataUsers);

//                                           GET
app.get("/products", (req, res) => {
  let { brand = null, price = null } = req.query;
  let { page = 1, take = 8 } = req.query;
  let start = (page - 1) * +take;
  let finish = start + +take;
  if (!brand && !price) {
    res.send(data.slice(start, finish));
  } else if (brand && price) {
    let filtered = data.filter(
      (prod) => prod.brand == brand && prod.price == price
    );
    res.end(JSON.stringify(filtered));
  } else if (brand) {
    let filtered = data.filter((prod) => prod.brand == brand);
    res.end(JSON.stringify(filtered));
  } else if (price) {
    let filtered = data.filter((prod) => prod.price == price);
    res.end(JSON.stringify(filtered));
  }
});

//                                          POST
app.post("/products", (req, res) => {
  let body = req.body;

  body.id = data.length + 1;

  data.push(body);

  fs.writeFileSync(
    join(__dirname, "database", "data.json"),
    JSON.stringify(data)
  );

  res.status(201).send(body);
});

//                                          PATCH
app.patch("/products/:id", (req, res) => {
  const body = req.body;

  let { id } = req.params;
  let info = body;
  let eski = data.find((p) => p.id == id);
  let i = data.indexOf(eski);
  if (!(i == -1)) {
    let change = { ...eski, ...info };
    data.splice(i, 1, change);
    fs.writeFileSync(
      join(__dirname, "database", "data.json"),
      JSON.stringify(data)
    );
    res.end(JSON.stringify(body));
  } else {
    res.status(404).end("Notog'ri id kiritilgan!!!");
  }
});

//                                          DELETE
app.delete("/products/:id", (req, res) => {
  let { id } = req.params;
  let eski = data.find((p) => p.id == id);
  let i = data.indexOf(eski);
  if (!(i == -1)) {
    data.splice(i, 1);

    fs.writeFileSync(
      join(__dirname, "database", "data.json"),
      JSON.stringify(data)
    );
    res.status(204).end();
  } else {
    res.status(404).end("Notog'ri id kiritilgan!!!");
  }
});

//                                      user register page and login page

app.post("/users/register", (req, res) => {
  let user = req.body;
  if (user.password && user.name) {
    if (!dataUsers.some((u) => u.name == user.name)) {
      let last = dataUsers[dataUsers.length - 1]?.id
        ? dataUsers[dataUsers.length - 1]?.id
        : 0;
      let newUser = user;
      newUser.id = last + 1;
      dataUsers.push(newUser);
      fs.writeFileSync(
        join(__dirname, "database", "dataUsers.json"),
        JSON.stringify(dataUsers)
      );
      res.status(201).end("Registratsiyadan o'tdingiz!");
    } else {
      res.status(401).end("Bunaqa user allaqachon yaratilgan!");
    }
  } else {
    res.status(400).end("ERROR: name or password is undefined!!!");
  }
});

app.post("/users/login", (req, res) => {
  let user = req.body;
  if (user.password && user.name) {
    if (
      dataUsers.some((u) => u.name == user.name && u.password == user.password)
    ) {
      res.status(200).end("Login qildingiz!");
    } else {
      res.status(401).end("login yoki parol xato!");
    }
  } else {
    res.status(400).end("ERROR: name or password is undefined!!!");
  }
});

app.get("/users", (req, res) => {
  res.end(JSON.stringify(dataUsers));
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
