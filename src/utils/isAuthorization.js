const user_screens = localStorage.getItem('userScreens')
  ? JSON.parse(localStorage.getItem('userScreens'))
  : null

export const isAuthorizatoin = (route) => {
  if (!JSON.parse(localStorage.getItem('UserData'))) {
    return '/login'
  }

  var auth = false

  localStorage.getItem('userScreens') &&
    JSON.parse(localStorage.getItem('userScreens')).map((item) => {
      if (item.screen_route == route) {
        auth = true
      }
    })
  if (!auth) {

    return user_screens && `/${user_screens[0].main_page_route}`
  }
}
