import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const BASE_URL = "http://localhost:8000/api";

function App() {
  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    try{
      const users = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(users);
      if (!users.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await users.json();
      setUsers(data);
    }catch{
      console.log("Error");
    }
  }

  useEffect(() => {
    getUsers();
  })

  return (
    <div className="App">
      <code>
        <pre>
          {JSON.stringify(users,null,2)}

        </pre>
      </code>
      <p>Data</p>
    </div>
  );
}

export default App;
