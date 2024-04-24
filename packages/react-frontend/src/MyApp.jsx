// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);

  function delUser(index) {
    const _id = characters[index]._id;
    const promise = fetch(`http://localhost:8000/users/${_id}`, {
      method: "DELETE"
    })
    .then(response => {
      if(response.ok) {
        setCharacters((oldCharacters) => {
          return oldCharacters.filter((character) => character._id !== _id);
        });
      } else {
        console.log("Failed to delete user")
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  function updateList(person) { 
    console.log(characters);
    postUser(person)
      .then(response => {
        if (response.status === 201) {
          return response.json();
        }
      })
      .then(newUser => { 
        setCharacters([...characters, newUser]);
        console.log(characters);
      })
      .catch(error => {
        console.error('Error updating character:', error);
      });
  }
  
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={delUser}
      />
      <Form handleSubmit={updateList} />
    </div>
  );

}

export default MyApp;