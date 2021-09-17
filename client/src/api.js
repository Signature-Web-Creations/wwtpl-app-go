
export function getRecords() {
  return fetch("/records")
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
