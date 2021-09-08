
export function getRecords() {
  return fetch("/records")
    .then(res => res.json())
}

export function getRecordByID(id) {
  return fetch(`/records/${id}`)
    .then(res => res.json())
}
