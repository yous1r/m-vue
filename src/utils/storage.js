// token
export function getToken () {
  return JSON.parse(localStorage.getItem('token'))
}
export function addToken (value) {
  localStorage.setItem('token', JSON.stringify(value))
}
export function removeToken () {
  localStorage.removeItem('token')
}

// channels
export function setChannelList (value) {
  return localStorage.setItem('CHANNEL_LIST', JSON.stringify(value))
}
export function getChannelList () {
  return JSON.parse(localStorage.getItem(('CHANNEL_LIST')))
}
