import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UrlFor } from './routes'
import { getPublicListingData } from './api'
import { useSearchParams } from './hooks'
import { useAuth } from './auth.js'
import AdminListings from './admin/RecordTable'
import SearchForm from './SearchForm'
import PaginationButtons from './PaginationButton'

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

export default function Dashboard() {
  const auth = useAuth()
  const searchParameters = useSearchParams()
  const offset = getOffset(searchParameters)

  const [records, setRecords] = useState(null)
  const [years, setYears] = useState([])
  const [pages, setPages] = useState(null)
  const [status, setStatus] = useState(null)
  const [recordTypes, setRecordTypes] = useState([])
  const [collections, setCollections] = useState([])
  const [sourceArchives, setSourceArchives] = useState([])
  const [recordStatus, setRecordStatus] = useState([])

  const [searched, setSearched] = useState(false)

  const handleSearch = (searchParams) => {
    const {
      query,
      searchYear,
      searchCollection,
      searchSourceArchive,
      searchRecordType,
      searchStatus,
    } = searchParams
    const params = {
      offset,
      query,
      searchYear,
      searchCollection,
      searchSourceArchive,
      searchRecordType,
      searchStatus,
    }
    getPublicListingData(params).then(({ records, pages, years, status }) => {
      setRecords(records)
      setPages(pages)
      setYears(years)
      setStatus(status)
      setSearched(true)
    })
  }

  useEffect(() => {
    getPublicListingData({ offset }).then(
      ({
        records,
        pages,
        years,
        status,
        collections,
        sourceArchives,
        recordTypes,
        recordStatus,
      }) => {
        setRecords(records)
        setPages(pages)
        setYears(years)
        setStatus(status)
        setCollections(collections)
        setSourceArchives(sourceArchives)
        setRecordTypes(recordTypes)
        setRecordStatus(recordStatus)
      },
    )
  }, [offset])

  return (
    <>
      <Link
        to={UrlFor('addUser')}
        className="uk-button uk-button-primary uk-margin-right"
      >
        {' '}
        Add New User{' '}
      </Link>
      <Link to={UrlFor('showUsers')} className="uk-button uk-button-default">
        {' '}
        Manage Users{' '}
      </Link>

      <Link to={UrlFor('newRecord')} className="uk-button uk-button-default">
        {' '}
        New Record{' '}
      </Link>
      <SearchForm
        years={!years ? [] : years}
        recordTypes={recordTypes}
        collections={collections}
        sourceArchives={sourceArchives}
        status={recordStatus}
        isLoggedIn={auth.user}
        onSubmit={handleSearch}
      />
      <PaginationButtons currentPage={!offset ? 0 : offset} pages={pages} />

      {/*
       * List of pending records by default
       * Needs to include a records status in the records
       */}
      <AdminListings searched={searched} records={records} />
    </>
  )
}
