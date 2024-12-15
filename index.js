import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "pimpin",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function getItems(){
  const result = await db.query("SELECT * FROM items")
  items = result.rows;
  console.log("items = ", items)
  return items;
}


app.get("/", async (req, res) => {

  await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => {

  res.redirect("/")
});

app.post("/delete", async (req, res) => {
  console.log("req.body.deleteItemId = ", req.body.deleteItemId)
  await db.query("DELETE FROM items WHERE id = $1", [req.body.deleteItemId]);
  await getItems();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
