export function getPublicListingData(params) {
  const queryParameters = []
  const baseUri = '/api/public/records'

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

  let uri
  if (queryParameters.length !== 0) {
    uri = baseUri + `?${queryParameters.join('&')}`
  } else {
    uri = baseUri
  }

  return fetch(uri).then((res) => res.json())
}

export function getPublicRecordByID(id) {
  return fetch(`/api/public/records/${id}`).then((res) => res.json())
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

export function getUserData() {
  return fetch(`/api/user`).then((res) => res.json())
}

export async function createUser(userData) {
  const response = await fetch('/api/user', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }, 

      body: JSON.stringify(userData)
  })

  return response.json()
}
