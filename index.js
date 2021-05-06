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

app.get("/", (req, res) => {
  res.render("home");
});

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
  const { parkName, directionsURL, moreInfoURL, parkImage } = req.body;
  const { data, error } = await supabase.from("Parks").insert([
    {
      parkName: parkName,
      directionsURL: directionsURL,
      moreInfoURL: moreInfoURL,
      userId: req.session.user.userId,
      parkImage: parkImage,
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
  res.render("login", { locals: { message: "" } });
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
        res.render("login", {
          locals: { message: "Invalid username or password" },
        });
      }
    });
  } else {
    res.render("login");
  }
});

app.get("/explore", (req, res) => {
  if (req.session.user) {
    res.render("explore");
  } else {
    res.render("login", {
      locals: { message: "Please log in to explore parks" },
    });
  }
});

app.get("/view-all-trips", async (req, res) => {
  if (req.session.user) {
    const userId = req.session.user.userId;
    const { data, error } = await supabase
      .from("Trips")
      .select(
        `
    tripName, startDate, endDate,
    Parks:parkId ( parkName, parkImage, id )
  `
      )
      .match({ userId: userId })
      .order("id", { ascending: true });
    const objectOfTrips = {};
    data.forEach((trip) => {
      if (Object.keys(objectOfTrips).includes(trip.tripName)) {
        objectOfTrips[trip.tripName].push(trip);
      } else {
        objectOfTrips[trip.tripName] = [];
        objectOfTrips[trip.tripName].push(trip);
      }
    });
    res.render("itinerary", { locals: { objectOfTrips: objectOfTrips } });
  } else {
    res.render("login", {
      locals: { message: "Please log in to view your trips" },
    });
  }
});

app.post("/edit-trip/:tripName", async (req, res) => {
  const { tripName } = req.params;
  const newTripName = req.body.newTripName;
  const newStartDate = req.body.newStartDate;
  const newEndDate = req.body.newEndDate;
  const { data, error } = await supabase
    .from("Trips")
    .update({
      tripName: newTripName,
      startDate: newStartDate,
      endDate: newEndDate,
    })
    .match({ tripName: tripName });
  res.redirect("/view-all-trips");
});

app.post("/delete-trip/:tripName", async (req, res) => {
  const { tripName } = req.params;
  console.log(req.params);
  const { data, error } = await supabase
    .from("Trips")
    .delete()
    .match({ tripName: tripName });
  res.redirect("/view-all-trips");
});

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});

app.post("/delete-park/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const { data, error } = await supabase
    .from("Trips")
    .delete()
    .match({ parkId: Number(id) });
  res.redirect("/view-all-trips");
});
