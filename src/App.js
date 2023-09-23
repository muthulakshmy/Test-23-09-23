import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [popup, setPopup] = useState(false);
  const [editid, seteditid] = useState(null);

  const getData = () => {
    axios.get(`http://localhost:3030/posts`)
      .then((response) => setPosts(response.data))
      .catch((error) => console.log("error", error));
  }
  
  const postData = () => {
    if (editid) {
      axios({
        method: 'put',
        url: `http://localhost:3030/posts/${editid}`,
        data: {
          title: title,
          body: body
        }
      }).then(() => {
        
        setPosts(posts.map(post => post.id === editid ? { ...post, title, body } : post));
        seteditid(null);
      });
    } else {
      
      axios({
        method: 'post',
        url: 'http://localhost:3030/posts',
        data: {
          id: Date.now(),
          title: title,
          body: body
        }
      }).then(() => {
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
    seteditid(null)
  }

  function editTask(id, title, body) {
    setPopup(true)
    seteditid(id)
    setTitle(title)
    setBody(body)
  }


  function deleteTask(id) {
    axios({
      method: 'delete',
      url: `http://localhost:3030/posts/${id}`,
    }).then(() => {
      setPosts(posts.filter(post => post.id !== id));
    });
  }

  return (
    <div className="App">
      <button onClick={addTask}>Add +</button>
      {popup && (
        <div className='text_div'>
          <label>
            Title:
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Body:
            <input type="text" required value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
          <div className='button_div'>
            {editid ?(
              <button onClick={postData}>Update</button>
            ):
            (
              <button onClick={postData}>Add</button>
            )

            }
            
            
          </div>
        </div>
      )}

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>
              <span>{post.id}</span> {post.title}
            </h3>
            <p>{post.body}</p>
            <button onClick={() => editTask(post.id, post.title, post.body)}>Edit</button>
            <button onClick={() => deleteTask(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
