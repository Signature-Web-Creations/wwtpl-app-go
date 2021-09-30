import { useState, useEffect } from 'react'
import { Switch, Link, Route, Redirect } from 'react-router-dom'
import { UrlFor } from './routes'

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
import EditRecord from './admin/RecordForm'
import EditUser from './admin/EditUser'

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
  const [recordStatus, setRecordStatus] = useState([])

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
              {auth.user ? (
                <li>
                  <Link to={UrlFor('adminHome')}> Dashboard </Link>
                </li>
              ) : (
                <li>
                  <Link to={UrlFor('home')}> Home </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              {auth.user ? (
                <li>
                  <Link
                    to={UrlFor('logout')}
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
                  <Link to={UrlFor('login')}> Login </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      <Switch>
        <Route path={UrlFor('viewRecord')}>
          <Header>
            <h1 className="uk-text-lead"> History Record </h1>
          </Header>

          <RecordDetail records={records} />
        </Route>

        <Route path={UrlFor('login')}>
          <LoginForm />
        </Route>

        <PrivateRoute path={UrlFor('editRecord')}>
          <EditRecord
            recordTypes={recordTypes}
            collections={collections}
            sourceArchives={sourceArchives}
            recordStatus={recordStatus}
          />
        </PrivateRoute>

        <PrivateRoute path={UrlFor('adminHome')}>
          <Dashboard records={records} />
        </PrivateRoute>

        <PrivateRoute path={UrlFor('addUser')}>
          <EditUser />
        </PrivateRoute>

        <Route path={UrlFor('logout')}>
          <Redirect to={UrlFor('home')} />
        </Route>

        {auth.user ? (
          <Route path={UrlFor('home')}>
            <Redirect to={UrlFor('adminHome')} />
          </Route>
        ) : (
          <Route exact path={UrlFor('home')}>
            <Header>
              <h1 className="uk-text-lead"> History Listing </h1>
              <SearchForm
                years={!years ? [] : years}
                recordTypes={recordTypes}
                collections={collections}
                sourceArchives={sourceArchives}
                onSubmit={handleSearch}
              />
              <PaginationButtons
                currentPage={!offset ? 0 : offset}
                pages={pages}
              />
            </Header>
            <RecordTable searched={searched} records={records} />
          </Route>
        )}
      </Switch>
    </div>
  )
}

export default App
