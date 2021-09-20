
export function getListingData(params) {
  const queryParameters = []
  const baseUri = '/records'
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
    queryParameters.push(`collection=${encodeURIComponent(params.searchCollection)}`)
  }

  if (params.searchSourceArchive && params.searchSourceArchive !== '') {
    queryParameters.push(`sourceArchive=${encodeURIComponent(params.searchSourceArchive)}`)
  }
  
  if (params.searchRecordType && params.searchRecordType !== '') {
    queryParameters.push(`recordType=${encodeURIComponent(params.searchRecordType)}`)
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
