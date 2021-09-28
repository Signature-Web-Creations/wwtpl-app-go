import { useState, useEffect } from 'react'
import { Link, Route, Redirect } from 'react-router-dom'

import Header from './Header'
import PaginationButtons from './PaginationButton'
import SearchForm from './SearchForm'
import RecordTable from './RecordTable'
import RecordDetail from './RecordDetail'
import LoginForm from './LoginForm'

import Dashboard from './Dashboard'

import { getPublicListingData } from './api'
import { useSearchParams } from './hooks'
import { useAuth, PrivateRoute } from './auth.js'
import EditRecord from './admin/EditRecordDetail'

function getOffset(searchParameters) {
  let offsetParam = searchParameters.get('offset')
  if (offsetParam === null) {
    return 0
  }
  let offset = parseInt(offsetParam)
  if (isNaN(offset)) {
    return 0
  }

  return offset
}

function App() {
  const auth = useAuth()

  const searchParameters = useSearchParams()
  const offset = getOffset(searchParameters)

  const [records, setRecords] = useState(null)
  const [years, setYears] = useState([])
  const [pages, setPages] = useState(null)
  const [recordTypes, setRecordTypes] = useState([])
  const [collections, setCollections] = useState([])
  const [sourceArchives, setSourceArchives] = useState([])

  // stores whether a search was run or not
  // used to show different error messages in record table
  const [searched, setSearched] = useState(false)

  const handleSearch = (searchParams) => {
    const {
      query,
      searchYear,
      searchCollection,
      searchSourceArchive,
      searchRecordType,
    } = searchParams
    const params = {
      offset,
      query,
      searchYear,
      searchCollection,
      searchSourceArchive,
      searchRecordType,
    }
    getPublicListingData(params).then(({ records, pages, years }) => {
      setRecords(records)
      setPages(pages)
      setYears(years)
      setSearched(true)
    })
  }

  useEffect(() => {
    getPublicListingData({ offset }).then(
      ({ records, pages, years, collections, sourceArchives, recordTypes }) => {
        setRecords(records)
        setPages(pages)
        setYears(years)
        setCollections(collections)
        setSourceArchives(sourceArchives)
        setRecordTypes(recordTypes)
      },
    )
  }, [offset])

  return (
    <div className="uk-marign-top">
      <header>
        <h1> History Database </h1>
        <nav className="uk-navbar">
          <div className="uk-nav-bar-left">
            <ul className="uk-navbar-nav">
              <li>
                <Link to="/"> Home </Link>
              </li>
            </ul>
          </div>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              {auth.user ? (
                <li>
                  <Link
                    to="/logout"
                    onClick={() => {
                      auth.signout()
                    }}
                  >
                    {' '}
                    Logout{' '}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/login"> Login </Link>
                </li>
              )}
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

      <Route path="/edit">
        <EditRecord />
      </Route>

      <PrivateRoute path="/dashboard">
        <Dashboard />
      </PrivateRoute>

      <Route path="/logout">
        <Redirect to="/" />
      </Route>

      <Route exact path="/">
        <Header>
          <h1 className="uk-text-lead"> History Listing </h1>
          <SearchForm
            years={!years ? [] : years}
            recordTypes={recordTypes}
            collections={collections}
            sourceArchives={sourceArchives}
            onSubmit={handleSearch}
          />
          <PaginationButtons currentPage={!offset ? 0 : offset} pages={pages} />
        </Header>
        <RecordTable searched={searched} records={records} />
      </Route>
    </div>
  )
}

export default App
