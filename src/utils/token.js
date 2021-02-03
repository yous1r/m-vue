export function getToken () {
  return localStorage.getItem('token')
}
export function addToken (value) {
  localStorage.setItem('token', JSON.stringify(value))
}
export function removeToken () {
  localStorage.removeItem('token')
}
