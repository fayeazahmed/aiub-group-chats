import './App.css';
import { useEffect, useState } from "react"
import { HashRouter, Switch } from "react-router-dom";
import Chat from "./components/Chat"
import axios from 'axios';
import PrivateRoute from './components/PrivateRoute';
import Main from './components/Main';

function App() {
    const [user, setUser] = useState(null)
    const [bookmarks, setBookmarks] = useState([]);
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
      let tmpId = localStorage.getItem("aiub-gc-id")
      if(!tmpId) {
        tmpId = Date.now()
        localStorage.setItem("aiub-gc-id", tmpId)
      }
      axios.get(`/users/${tmpId}`)
        .then(res => setUser(res.data))
        .catch(e => console.log(e.message))
    }, [setBookmarks])

    if(!user) return null
    return (
        <HashRouter>
          <div className="App">
            <nav>
              <header>AIUB <span>Group Chats</span></header>
            </nav>
            <Main searchResult={searchResult} setSearchResult={setSearchResult} bookmarks={bookmarks} setBookmarks={setBookmarks} user={user} />
            <div onClick={() => setSearchResult([])}>
              <Switch>
                <PrivateRoute exact path="/:room" bookmarks={bookmarks} setBookmarks={setBookmarks} user={user} component={Chat} />
              </Switch>
            </div>
          </div>
        </HashRouter>
    );
}

export default App;
