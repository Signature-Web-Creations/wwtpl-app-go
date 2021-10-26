const routes = {
  adminHome: '/admin',
  home: '/',
  login: '/login',
  logout: '/logout',
  showUsers: '/users',
  addUser: '/adduser',
  editUser: {
    url: '/user/edit',
    params: {
      id: ':id'
    }
  },

  showSourceArchives: '/sourceArchives',
  addSourceArchive: '/sourceArchives/new',
  editSourceArchive: {
    url: '/sourceArchive/edit',
    params: {
      id: ':id',
    },
  },

  showRecordTypes: '/recordTypes',
  addRecordType: '/recordTypes/new',
  editRecordType: {
    url: '/recordType/edit',
    params: {
      id: ':id',
    },
  },

  showCollections: '/collections',
  addCollection: '/collections/new',
  editCollection: {
    url: '/collection/edit',
    params: {
      id: ':id',
    },
  },

  newRecord: '/record/new',
  editRecord: {
    url: '/record/edit',
    params: {
      id: ':id',
    },
  },
  viewRecord: {
    url: '/record/view',
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
