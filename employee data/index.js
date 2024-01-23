import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "Krishana@1",
    port: 5432,
});
db.connect();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try{
    const result = await db.query("SELECT * FROM employees");
    const employees = result.rows;
    console.log(employees);
    res.render("index.ejs", {employees, message: " "});
    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

app.post("/employees", async (req, res) => {
    const {name, country, state, city} = req.body;
    try{
        const result = await db.query("INSERT INTO employees (name, country, state, city) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, country, state, city]);
        console.log(result);
        // res.json(result.rows[0]);
        res.redirect("/");
        
    } catch (error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

app.post("/delete/:id", async(req, res) => {
    const employeeId = req.params.id;

    try{
        await db.query("DELETE FROM employees WHERE id=$1",[employeeId]);
        res.redirect("/");
    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });  