const express = require("express");
const app = express();
const es6Renderer = require("express-es6-template-engine");
app.engine("html", es6Renderer);
app.set("views", "client"); // will set when there is a folder to connect to
app.set("view engine", "html"); // will set when there is a folder to connect to
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const cors = require("cors");

const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://trvnebvemlsnomuzdgff.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDA2MTU1NCwiZXhwIjoxOTM1NjM3NTU0fQ.J892pC3M_hmQCZ91fkQoo-iUXuOoQuNrYzZ7la_idIk"
);
app.use(
  session({
    secret: "aksdjfj33",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors());
app.use(express.static(path.join(__dirname, "/client")));

let parkIdGlobal = "";

const PORT = 3000;

app.get("/register", (req, res) => {
  console.log(req.body);
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  const SALT = await bcrypt.genSalt();
  const hash = await bcrypt.hash(req.body.password, SALT);
  const { data, error } = await supabase.from("Users").insert([
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: hash,
    },
  ]);
  console.log("REGISTERED");
  res.redirect("explore");
});

app.post("/addToParksDB", async (req, res) => {
  const { parkName, directionsURL, moreInfoURL } = req.body;
  const { data, error } = await supabase.from("Parks").insert([
    {
      parkName: parkName,
      directionsURL: directionsURL,
      moreInfoURL: moreInfoURL,
      userId: req.session.user.userId,
    },
  ]);
  console.log(data);
  parkIdGlobal = data[0].id;
  res.send("WORKS~!");
});

app.post("/addToTripsDB", async (req, res) => {
  const { tripName, startDate, endDate } = req.body;
  console.log(parkIdGlobal);

  const { data, error } = await supabase.from("Trips").insert([
    {
      userId: req.session.user.userId,
      tripName: tripName,
      startDate: startDate,
      endDate: endDate,
      parkId: parkIdGlobal,
    },
  ]);
  console.log(data);
  res.send("WORKS~!");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password; //delete later if not scared
  const { data, error } = await supabase
    .from("Users")
    .select()
    .match({ username: username });
  if (data.length > 0) {
    bcrypt.compare(req.body.password, data[0].password, (error, result) => {
      if (result) {
        if (req.session) {
          req.session.user = { userId: data[0].id, username: data[0].username };
        } else res.redirect("login");
        res.redirect("explore");
      } else {
        res.render("login", { locals: { message: "Check Your Password" } });
      }
    });
  } else {
    res.render("login");
  }
});

app.get("/explore", (req, res) => {
  res.render("explore");
});

// Pulls all data from "Users" table. Console logging to ensure data is pulled correctly.
// app.get("/getdata", async (req, res) => {
//   const { data, error } = await supabase.from("Users").select();
//   console.log(data);
//   res.send("GOT THE DATA!");
// });

// // finds User named "Bob" and updates their name to "New Zealand". Can match with any of the column names (id, lastName, etc).
// app.post("/updatedata", async (req, res) => {
//   const { data, error } = await supabase
//     .from("Users")
//     .update({ firstName: "New Zealand" })
//     .match({ firstName: "Bob" });
//   console.log(data);
//   res.send("CHANGED!");
// });

// // deletes data from "Parks" table with the name of "Yellowstone"
// app.post("/deletedata", async (req, res) => {
//   const { data, error } = await supabase
//     .from("Parks")
//     .delete()
//     .match({ parkName: "Yellowstone" });
//   res.send("GONE!");
// });

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
