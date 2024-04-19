// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  user.id = createId()
  //console.log("Updating character with ID in adduser:", user.id);
  users["users_list"].push(user);
  return user;
};

const findUserNameJob = (name, job) => {
  return users.users_list.filter((user) => user["name"] === name && user["job"] === job);
}

const deleteUser = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] == id);
  //console.log("Updating character with index:", index, "id:", id);
  //console.log(users["users_list"]);

  if(index != -1) {
    users["users_list"].splice(index, 1);
    return true;
  } else {
    return false;
  }
};

const createId = () => {
  return Math.floor(Math.random() * 10000);
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job == undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else if(name != undefined && job != undefined){
    let result = findUserNameJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else{
    res.send(users);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = addUser(userToAdd);
  res.status(201).send(newUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  //console.log("Updating character with ID:", id);
  let result = deleteUser(id);
  if(result) {
    res.send("Successfully deleted user");
  } else {
    res.status(404).send("User not found.");
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});



app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});