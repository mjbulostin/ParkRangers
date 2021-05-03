const express = require("express");
const app = express();
const { createClient } = require("@supabase/supabase-js");

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://trvnebvemlsnomuzdgff.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDA2MTU1NCwiZXhwIjoxOTM1NjM3NTU0fQ.J892pC3M_hmQCZ91fkQoo-iUXuOoQuNrYzZ7la_idIk"
);

const PORT = 3000;

app.post("/create", async (req, res) => {
  const { data, error } = await supabase.from("Users").insert([
    {
      firstName: "Bob",
      lastName: "Bobberson",
      email: "bobby@gmail.com",
      username: "bob1234",
      password: "urmom",
    },
  ]);
  res.send("WORKED!");
});

app.post("/create", async (req, res) => {
  const { data, error } = await supabase.from("Users").insert([
    {
      firstName: "Bob",
      lastName: "Bobberson",
      email: "bobby@gmail.com",
      username: "bob1234",
      password: "urmom",
    },
  ]);
  res.send("WORKED!");
});

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
