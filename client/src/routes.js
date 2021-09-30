const routes = {
  adminHome: '/admin',
  home: '/',
  login: '/login',
  logout: '/logout',
  showUsers: '/users',
  addUser: '/adduser',
  editRecord: {
    url: '/editrecord',
    params: {
      id: ':id',
    },
  },
  viewRecord: {
    url: '/record',
    params: {
      id: ':id',
    },
  },
}

export function UrlFor(name, params) {
  let route = ''

  if (typeof routes[name] === 'string') {
    route = routes[name]
  } else {
    if (params !== undefined) {
      route = routes[name].url + '/' + params.id
    } else {
      route = routes[name].url + '/' + routes[name].params.id
    }
  }

  if (route === undefined) {
    throw new Error(`Route doesn't exist: ${name}`)
  }

  return route
}
