import {useState, useEffect} from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom'; 

import Header from './Header';
import SearchForm from './SearchForm'; 
import RecordTable from './RecordTable';
import RecordDetail from './RecordDetail';
import LoginForm from './LoginForm';

import {getListingData} from './api';


function App() {
  const [records, setRecords] = useState(null)
  const [years, setYears] = useState([])
  const [pages, setPages] = useState([])

  const [query, setQuery] = useState("")
  const [searchYear, setSearchYear] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    getListingData({query, searchYear}).then(({records}) => setRecords(records))
  }

  useEffect(() => {
    getListingData({}).then(({records, pages, years}) => {
      setRecords(records)
      setPages(pages)
      setYears(years)
    })
  }, [])


  return (
      <BrowserRouter>
        <div className="uk-marign-top">
          <header>
            <h1> History Database </h1>
            <nav className="uk-navbar">
              <div className="uk-nav-bar-left">
                <ul className="uk-navbar-nav">
                  <li><Link to="/"> Home </Link></li>
                </ul>
              </div>
              <div className="uk-navbar-right">
                <ul className="uk-navbar-nav">
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
              <SearchForm
                years={!years ? [] : years}
                changeYear={(e) => {
                  console.log("Selected year ", e.target.value)
                  setSearchYear(e.target.value)
                }}
                changeQuery={(e) => {
                  setQuery(e.target.value)
                }}
                onSubmit={handleSearch}/>
            </Header>
            <RecordTable records={!records ? [] : records} />
          </Route>

        </div>
      </BrowserRouter>
  );
}

export default App;
