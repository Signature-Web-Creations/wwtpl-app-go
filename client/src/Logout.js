import {Redirect} from 'react-router-dom'; 
import {logout} from './api';
import {useState, useEffect} from 'react';

export default function Logout(props) {

  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    logout().then(() => {
      setRedirect(true)
    })
  }, [])

  if (redirect) {
    return (<Redirect to="/" />)
  } else {
    return (<h1> Logging out </h1>)
  }
}
