import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [popup, setPopup] = useState(false);
  const [editId, setEditId] = useState(null);

  const getData = () => {
    axios.get(`http://localhost:3030/posts`)
      .then((response) => setPosts(response.data))
      .catch((error) => console.log("error", error));
  }
  
  const postData = () => {
    setPopup(false)
    if (editId) {
     
      axios.put(`http://localhost:3030/posts/${editId}`,{ title:title,body:body})
      .then(()=>{
        setPosts(posts.map(post => post.id === editId ? { ...post, title, body } : post));
        setEditId(null);
      })
    } else {
      
      axios.post('http://localhost:3030/posts', {
            id: Date.now(),
            title: title,
            body: body
          })
          .then(() => {
        getData()
      })

    }
    
 
    setTitle('')
    setBody('')
  }

  useEffect(() => {
    getData()
  }, []);

  function addTask() {
    setPopup(true);
    setEditId(null)
  }

  function editTask(id, title, body) {
    setPopup(true)
    setEditId(id)
    setTitle(title)
    setBody(body)
  }


  function deleteTask(id) {
   
    axios.delete(`http://localhost:3030/posts/${id}`)
    .then(() => {
      
        getData()
      });
  }

  return (
    <div className="App">
      
      <button onClick={addTask} className='add'>Add +</button>
      {popup && (
        <div className='text_div'>
          <label>
            Title:
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Body:
            <input type="text"required value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
          <div className='button_div'>
            {editId ?(
              <button onClick={postData} className='button_update'>Update</button>
            ):
            (
              <button onClick={postData} className='button_add'>Add</button>
            )

            }
            
            
          </div>
        </div>
      )}

      <div className='color'>
        {posts.map((post) => (
          <div key={post.id} className='display_div'>
            <h3>
               {post.title}
            </h3>
            <p>{post.body}</p>
            <button onClick={() => editTask(post.id, post.title, post.body)}>Edit</button>
            <button onClick={() => deleteTask(post.id)}>Delete</button>
            <br/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
