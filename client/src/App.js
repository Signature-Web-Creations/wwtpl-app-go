import {useState, useEffect} from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom'; 

import Header from './Header';
import SearchForm from './SearchForm'; 
import RecordTable from './RecordTable';
import RecordDetail from './RecordDetail';
import LoginForm from './LoginForm';

import {getRecords} from './api';


function App() {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    getRecords().then(setRecords)
  }, [])


  return (
      <BrowserRouter>
        <div className="uk-marign-top">
          <header>
            <h1> History Database </h1>
            <nav class="uk-navbar">
              <div class="uk-nav-bar-left">
                <ul class="uk-navbar-nav">
                  <li><Link to="/"> Home </Link></li>
                </ul>
              </div>
              <div class="uk-navbar-right">
                <ul class="uk-navbar-nav">
                  <li><Link to="/login"> Login </Link></li>
                </ul>
              </div>
            </nav>
          </header>
          <Route path="/record/:id">
            <Header>
               <h1 className="uk-text-lead"> History Record </h1>
            </Header>

            <RecordDetail records={records} />
          </Route> 

          <Route path="/login">
            <LoginForm />
          </Route>
          <Route exact path="/"> 
            <Header>
               <h1 className="uk-text-lead"> History Listing </h1>
               <SearchForm />
            </Header>
            <RecordTable records={!records ? [] : records} />
          </Route>

        </div>
      </BrowserRouter>
  );
}

export default App;
