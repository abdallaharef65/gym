const user_screens = localStorage.getItem('userScreens')
  ? JSON.parse(localStorage.getItem('userScreens'))
  : null

export const isAuthorizatoin = (route) => {
  // console.log('isAuthorizatoin')
  if (!JSON.parse(localStorage.getItem('UserData'))) {
    return '/login'
  }
  // console.log(JSON.parse(localStorage.getItem('userScreens')))
  // console.log(route)
  var auth = false

  localStorage.getItem('userScreens') &&
    JSON.parse(localStorage.getItem('userScreens')).map((item) => {
      if (item.screen_route == route) {
        auth = true
      }
    })
  if (!auth) {
    // console.log(JSON.parse(localStorage.getItem('userScreens')))
    console.log(user_screens)
    return user_screens && `/${user_screens[0].main_page_route}`
  }
}
