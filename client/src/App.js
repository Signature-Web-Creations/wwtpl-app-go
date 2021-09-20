import {useState, useEffect} from 'react';
import {Link, Route, useLocation} from 'react-router-dom'; 

import Header from './Header';
import PaginationButtons from './PaginationButton';
import SearchForm from './SearchForm'; 
import RecordTable from './RecordTable';
import RecordDetail from './RecordDetail';
import LoginForm from './LoginForm';

import {getListingData} from './api';

function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

function getOffset(searchParameters) {
  let offsetParam = searchParameters.get("offset") 
  if (offsetParam === null) {
    return 0
  } 
  let offset = parseInt(offsetParam) 
  if (isNaN(offset)) {
    return 0
  } 

  return offset;
}

function App() {
  const searchParameters = useSearchParams()
  const offset = getOffset(searchParameters)

  const [records, setRecords] = useState(null)
  const [years, setYears] = useState([])
  const [pages, setPages] = useState(null)

  const [query, setQuery] = useState("")
  const [searchYear, setSearchYear] = useState("")

  // stores whether a search was run or not
  // used to show different error messages in record table
  const [searched, setSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    getListingData({offset, query, searchYear}).then(({records}) => {
      setRecords(records)
      setSearched(true)
    })
  }

  useEffect(() => {
    getListingData({offset}).then(({records, pages, years}) => {
      setRecords(records)
      setPages(pages)
      setYears(years)
    })
  }, [offset])


  return (
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
              <PaginationButtons currentPage={!offset ? 0 : offset} pages={pages} />
            </Header>
            <RecordTable searched={searched} records={records} />
          </Route>

        </div>
  );
}

export default App;
