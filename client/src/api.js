
export function getListingData(params) {
  const queryParameters = []
  const baseUri = '/records'
  if (params.query && params.query !== '') {
    queryParameters.push(`query=${encodeURIComponent(params.query)}`)
  }

  if (params.searchYear && params.searchYear !== '') {
    queryParameters.push(`year=${encodeURIComponent(params.searchYear)}`)
  }

  let uri;
  if (queryParameters.length !== 0) {
    uri = baseUri + `?${queryParameters.join('&')}`
  } else {
    uri = baseUri 
  }
  return fetch(uri)
    .then(res => res.json())
}

export function getRecords(params) {

  const queryParameters = []
  const baseUri = '/records'
  if (params.query && params.query !== '') {
    queryParameters.push(`query=${encodeURIComponent(params.query)}`)
  }

  let uri;
  if (queryParameters.length !== 0) {
    uri = baseUri + `?${queryParameters.join('&')}`
  } else {
    uri = baseUri 
  }
  return fetch(uri)
    .then(res => res.json())
}

export function getRecordByID(id) {
  return fetch(`/records/${id}`)
    .then(res => res.json())
}

export function getPageCount() {
  return fetch('/pages/')
    .then(res => res.json())
}

export async function login(username, password) {
  const data = {username, password} 

  const response = await fetch('/login', {
    method: 'POST',
    mode: 'same-origin', 
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  console.log('Headers: ', response.headers)
  return response
}
