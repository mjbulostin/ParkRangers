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



app.use(passport.initialize())
app.use(passport.session())

const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://trvnebvemlsnomuzdgff.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDA2MTU1NCwiZXhwIjoxOTM1NjM3NTU0fQ.J892pC3M_hmQCZ91fkQoo-iUXuOoQuNrYzZ7la_idIk"
);

const PORT = 3000;
const SALT_ROUNDS = 10;

// // creates entry into "Parks" method using data supplied. Can pull this data from a form on site.
// app.post("/create", async (req, res) => {
//   const { data, error } = await supabase.from("Parks").insert([
//     {
//       parkName: "Redwood Forest",
//       directionsURL: "www.redwoods.com",
//       moreInfoURL: "wwww.moreredwoodinfo.com",
//       userId: 4,
//     },
//   ]);
//   res.send("WORKED!");
// });

app.get('/register', (req,res) => {
  res.render('register')
})

app.post('/register', async (req,res) => {

  const { firstName, lastName, email, username, password } = req.body

  const hash = bcrypt.hash(password,SALT_ROUNDS, function(error,hash) {
    if(error == null){return hash}})

    const { data, error } = await supabase.from("Users").insert([
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: hash,
    },
  ]);
  console.log("REGISTERED")
  res.redirect('explore')
})

app.get('/login', (req,res) => {
  res.render('login')
})
app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  const { user, error } = await supabase
    .from("Users")
    .select()
    .match({ username: username })
  if (user != null) {
    console.log("not null")
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        if (req.session) {
          req.session.user = { userId: user.id };
          res.redirect("explore");
        }
      } else {
        res.send("no result");
      }
    });
  } else {
    res.render("login", { message: "Incorrect Username or Password" });
  }
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
