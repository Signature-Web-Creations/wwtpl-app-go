const routes = {
  adminHome: '/admin',
  home: '/',
  login: '/login',
  logout: '/logout',
  addUser: '/adduser',
  editRecord: '/editrecord/:id',
  viewRecord: '/record/:id',
}

export function UrlFor(name) {
  const route = routes[name]

  if (route === undefined) {
    throw new Error(`Route doesn't exist: ${name}`)
  }

  return route
}
