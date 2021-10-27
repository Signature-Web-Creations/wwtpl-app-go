import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UrlFor } from './routes'
import { getListingData, restoreRecord, deleteRecord } from './api'
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
  const [recordTypes, setRecordTypes] = useState([])
  const [collections, setCollections] = useState([])
  const [sourceArchives, setSourceArchives] = useState([])
  const [recordStatus, setRecordStatus] = useState([])

  const [searched, setSearched] = useState(false)

  const toggleDelete = function (id) {
    let deleted = false
    let updatedRecords = records.map((r) => {
      if (r.id === id) {
        r.deleted = !r.deleted
        deleted = r.deleted
        return r
      } else {
        return r
      }
    })
    if (deleted) {
      deleteRecord(id)
    } else {
      restoreRecord(id)
    }
    setRecords(updatedRecords)
  }

  const handleSearch = (searchParams) => {
    if (!auth.user) return
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
    getListingData(params).then(({ records, pages, years }) => {
      setRecords(records)
      setPages(pages)
      setYears(years)
      setSearched(true)
    })
  }

  useEffect(() => {
    getListingData({ offset }).then(
      ({
        records,
        pages,
        years,
        collections,
        sourceArchives,
        recordTypes,
        recordStatus,
      }) => {
        setRecords(records)
        setPages(pages)
        setYears(years)
        setCollections(collections.collections)
        setSourceArchives(sourceArchives)
        setRecordTypes(recordTypes)
        setRecordStatus(recordStatus)
      },
    )
  }, [offset, auth.user])

  return (
    <>
      {auth.user.role === 'admin' && (
        <Link
          to={UrlFor('showUsers')}
          className="uk-button uk-button-default uk-margin-right"
        >
          {' '}
          Manage Users{' '}
        </Link>
      )}

      {auth.user.role === 'admin' && (
        <Link
          to={UrlFor('showSourceArchives')}
          className="uk-button uk-button-default uk-margin-right"
        >
          {' '}
          Manage Source Archives{' '}
        </Link>
      )}

      {auth.user.role === 'admin' && (
        <Link
          to={UrlFor('showCollections')}
          className="uk-button uk-button-default uk-margin-right"
        >
          {' '}
          Manage Collections{' '}
        </Link>
      )}

      {auth.user.role === 'admin' && (
        <Link
          to={UrlFor('showRecordTypes')}
          className="uk-button uk-button-default uk-margin-right uk-margin-top"
        >
          {' '}
          Manage Record Types{' '}
        </Link>
      )}

      {auth.user.role === 'admin' && (
        <a
          href="/api/exportCSV"
          target="_blank"
          download
          className="uk-button uk-button-default uk-margin-right uk-margin-top">
          Export CSV
        </a>
      )}

      <Link
        to={UrlFor('newRecord')}
        className="uk-button uk-button-default uk-margin-right uk-margin-top"
      >
        {' '}
        New Record{' '}
      </Link>

      <SearchForm
        years={!years ? [] : years}
        recordTypes={recordTypes}
        collections={collections}
        sourceArchives={sourceArchives}
        status={recordStatus}
        user={auth.user}
        onSubmit={handleSearch}
      />
      <PaginationButtons
        currentPage={!offset ? 0 : offset}
        pages={pages}
        type="admin"
      />

      {/*
       * List of pending records by default
       * Needs to include a records status in the records
       */}
      <AdminListings
        searched={searched}
        records={records}
        user={auth.user}
        onDelete={toggleDelete}
      />
    </>
  )
}
