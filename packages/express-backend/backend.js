// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let promise;

  if (name != undefined && job == undefined) {
    promise =  userServices.findUserByName(name);
  } else if (name == undefined && job != undefined) {
    promise = userServices.findUserByJob(job);
  } else if (name != undefined && job != undefined) {
    promise = userServices.findUserNameJob(name, job);
  } else {
    promise = userServices.getUsers();
  }
  promise.then((result) => {
    res.json({ users_list: result });
  });

});

app.post("/users", async (req, res) => {
  const userToAdd = req.body;
  let promise = userServices.addUser(userToAdd); 
  promise.then((newUser) => {
    res.status(201).json(newUser); 
  })
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  console.log("Updating character with ID:", id);
  let promise = userServices.deleteUserById(id);
  promise.then((result) => {
    if(result) {
      res.send("Successfully deleted user");
    } else {
      res.status(404).send("User not found.");
    }
  })
  .catch((error) => {
    res.status(500).send("Internal server error");
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let promise = userServices.findUserById(id);
  promise.then((result) => {
    if(result != undefined) {
      res.json({ users_list: result})
    } else {
      res.status(404).send("Resource not found.");
    }
  })
  .catch((error)=> {
    res.status(500).send("Internal server error.")
  }) 
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});