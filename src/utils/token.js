export function getToken () {
  localStorage.getItem('token')
}
export function addToken (value) {
  localStorage.setItem('token', value)
}
export function removeToken () {
  localStorage.removeItem('token')
}
