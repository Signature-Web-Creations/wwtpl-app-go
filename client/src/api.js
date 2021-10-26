const getQueryParameters = (params) => {
  const queryParameters = []
  if (params.offset && params.offset !== null) {
    queryParameters.push(`offset=${encodeURIComponent(params.offset)}`)
  }

  if (params.query && params.query !== '') {
    queryParameters.push(`query=${encodeURIComponent(params.query)}`)
  }

  if (params.searchYear && params.searchYear !== '') {
    queryParameters.push(`year=${encodeURIComponent(params.searchYear)}`)
  }

  if (params.searchCollection && params.searchCollection !== '') {
    queryParameters.push(
      `collection=${encodeURIComponent(params.searchCollection)}`,
    )
  }

  if (params.searchSourceArchive && params.searchSourceArchive !== '') {
    queryParameters.push(
      `sourceArchive=${encodeURIComponent(params.searchSourceArchive)}`,
    )
  }

  if (params.searchRecordType && params.searchRecordType !== '') {
    queryParameters.push(
      `recordType=${encodeURIComponent(params.searchRecordType)}`,
    )
  }

  if (params.searchRecordStatus && params.searchRecordStatus !== '') {
    queryParameters.push(
      `recordStatus=${encodeURIComponent(params.searchRecordStatus)}`,
    )
  }
  return queryParameters
}

const buildURLWithQueryParameters = (baseUri, params) => {
  const queryParameters = getQueryParameters(params)

  if (queryParameters.length !== 0) {
    return baseUri + `?${queryParameters.join('&')}`
  } else {
    return baseUri
  }
}

// Returns listing data for dashboard.
// Records are returned based on if the user is an editor, publisher
// or admin
export function getListingData(params) {
  const uri = buildURLWithQueryParameters('/api/records', params)
  return fetch(uri).then((res) => res.json())
}

// Returns listing data for public users
export function getPublicListingData(params) {
  const uri = buildURLWithQueryParameters('/api/public/records', params)
  return fetch(uri).then((res) => res.json())
}

export function getPublicRecordByID(id) {
  return fetch(`/api/public/records/${id}`).then((res) => res.json())
}

// Retrieves a record by its id regardless of status.
// User must be logged in
export async function getRecordByID(id) {
  const response = await fetch(`/api/records/${id}`, {
    method: 'GET',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
  })

  return await response.json()
}

export async function login(username, password) {
  const data = { username, password }

  const response = await fetch('/api/login', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return response.json()
}

export async function logout() {
  return fetch('/api/logout', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
  })
}

// Returns user data for the logged in user.
// If user is not logged in returns an error message
export function getUserData() {
  return fetch(`/api/user`).then((res) => res.json())
}

// Creates a new user. User must be authenticated
// and an admin to succeed
export async function createUser(userData) {
  const response = await fetch('/api/user', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(userData),
  })

  return response.json()
}

// Updates a user. User must be authenticated
// and an admin to succeed
export async function updateUser(userId, userData) {
  const response = await fetch(`/api/user/${userId}`, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(userData),
  })

  return response.json()
}

export async function getUser(userId) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'GET',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
  })
  return response.json() 
}

// Returns a json list of users. If the user is not
// authenticated returns a 401 unauthorized
export async function getUsers() {
  const response = await fetch('/api/users', {
    method: 'GET',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
  })

  return response.json()
}

// Returns a list of user roles.
export async function getUserRoles() {
  const response = await fetch('/api/user_roles', {
    method: 'GET',
    mode: 'same-origin',
    cache: 'no-cache',
  })

  return response.json()
}

// Disables a user
export async function disableUser(userId) {
  const response = await fetch(`/api/user/disable/${userId}`, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}

// Enables a user
export async function enableUser(userId) {
  const response = await fetch(`/api/user/enable/${userId}`, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}

const recordToForm = (record) =>  {
  const formData = new FormData()
  formData.append('title', record.title)
  formData.append('content', record.content)

  if (record.file !== null) {
    formData.append('file', record.file)
  }

  formData.append('date', record.date)
  formData.append('author', record.author)
  formData.append('recordType', record.recordType)
  formData.append('sourceArchive', record.sourceArchive)
  formData.append('collections', record.collections)
  formData.append('recordStatus', record.recordStatus)
  formData.append('shouldKeepFile', record.shouldKeepFile)

  return formData
}

export async function saveRecord(record) {

  const response = await fetch('/api/records', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    body: recordToForm(record),
  })

  return response.json()
}

export async function updateRecord(recordId, record) {
  const response = await fetch(`/api/records/${recordId}`, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    body: recordToForm(record),
  })
  return response.json()
}

export async function changeRecordStatus(recordId, recordStatusId) {
  const response = await fetch(`/api/records/status/${recordId}`, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recordId, recordStatusId }),
  })
  return response.json()
}

export async function deleteRecord(recordId) {
  const response = await fetch(`/api/records/delete/${recordId}`, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response
}

export async function restoreRecord(recordId) {
  const response = await fetch(`/api/records/restore/${recordId}`, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response
}

export async function getSourceArchives() {
  const response = await fetch('/api/sourceArchives', {
    method: 'GET', 
    mode: 'same-origin', 
    cache: 'no-cache', 
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response.json()
}

export async function addSourceArchive(name) {
  let formData = new FormData()
  formData.append("name", name)

  const response = await fetch('/api/sourceArchives', {
    method: 'POST', 
    mode: 'same-origin', 
    cache: 'no-cache', 
    credentials: 'include', 
    body: formData,
  })
  return response.json()
}

export async function updateSourceArchive(id, name) {
  let formData = new FormData()
  formData.append("name", name)

  const response = await fetch(`/api/sourceArchives/${id}`, {
    method: 'POST', 
    mode: 'same-origin', 
    cache: 'no-cache', 
    credentials: 'include', 
    body: formData,
  })
  return response.json()
}
