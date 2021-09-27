import {useState, useContext, createContext} from 'react';
import {login, logout} from './api'; 
import {Route, Redirect} from 'react-router-dom';


// Code for creating authContext and hooks 
// Adapted from https://usehooks.com/useAuth/
const authContext = createContext();

// Hook for components to get the auth object
// and re-render when it changes
export function useAuth() {
  return useContext(authContext) 
}

// Provider hook that creates auth object and handles state
export function useProvideAuth() {
  const [user, setUser] = useState(false) 

  const signin = (username, password, onError) => {
    login(username, password).then(result => {
      if (result.success) {
        setUser(result.user)
      } else {
        onError('invalid username/password')
      }
    })
  }

  const signout = () => {
    logout().then(() => {
      setUser(false)
    })
  }

  return {
    user, 
    signin,
    signout,
  }
}

// Provider component that wraps your app and makes auth object
// available to any child component that calls useAuth()
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}


export function PrivateRoute({children, ...rest}) {
  let auth = useAuth()
  return (
    <Route
      {...rest}
      render={() => 
        auth.user ? (
          children
        ) : (
          <Redirect 
            to="/" />
        )
      }
    />
  )
}
