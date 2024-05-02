import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CNavGroup,
  CNavItem,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { selectDataByParam } from '../helper'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [nav, setNav] = useState(null)

  useEffect(() => {
    ;(async () => {
      if (true) {
        //screen
        const param = 'role_id=1'

        var screen = await selectDataByParam('role_screens', param)
        screen = screen.data
        let screenArr = []
        for (let index = 1; index <= 10; index++) {
          
          const foundGroup = screen.filter((item) => item.group_screen_id == index)
          if (foundGroup.length > 0) {
            if (foundGroup[0].group_screen_id == index)
              //drop down list
              screenArr.push({
                component: CNavGroup,
                name: foundGroup[0].screen_group_name_en,
                to: '/',
                // icon: getIcon(foundGroup[0]),
                items: foundGroup.map((item) => ({
                  component: CNavItem,
                  name: item.screen_name_en,
                  to: item.screen_route,
                })),
              })
          }
        }
        console.log(screenArr)
        // setNav(screenArr)

        setNav([
          ...screenArr,
          // {
          //   component: CNavItem,
          //   name: 'Invoices ',
          //   to: '/invoices',
          // },
        ])
      }
    })()
  }, [])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={nav} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
