import { Link } from 'react-router-dom'
import AdminListings from './admin/RecordTable'
import {UrlFor} from './routes.js'

export default function Dashboard(props) {
  return (
    <>
      <Link
        to="/adduser"
        className="uk-button uk-button-primary uk-margin-right"
      >
        {' '}
        Add New User{' '}
      </Link>
      <Link to="/adduser" className="uk-button uk-button-default">
        {' '}
        Update Users{' '}
      </Link>
      <Link to={UrlFor('showUsers')} className="uk-button uk-button-default">
        {' '}
        Manage Users{' '}
      </Link> 

      {/* Search Form for Admins should go here */}

      {/*
       * List of pending records by default
       * Needs to include a records status in the records
       */}
      <AdminListings records={props.records} />
    </>
  )
}
