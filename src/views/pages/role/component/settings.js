/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { cleanupRoleScreen, setNavigation } from '../../../../redux/Reducer/roleReducer/roleSlice'
const Settings = ({ screens, id }) => {
  const [settingsScreens, setSettingsScreens] = useState([])
  const [checkAll, setCheckAll] = useState(false)

  const selectedNav = useSelector((state) => state.rolesSlice.roleScreen)

  const dispatch = useDispatch()
  useEffect(() => {
    const dataScreen = screens
      .filter((x) => x.group_screen_id == 3)
      .map((item) => ({
        ...item,
      }))
    setSettingsScreens(dataScreen)

    //.filter((x) => x.group_screen_id == 3) Settings
    //.filter((x) => x.group_screen_id == 2)

    const AppointmentScreen = screens.filter((x) => x.group_screen_id == 2)

    dispatch(
      setNavigation({
        ...selectedNav,
        settingsScreen: dataScreen,
        AppointmentScreen: AppointmentScreen.map((item) => ({
          ...item,

        })),
      }),
    )
  }, [id])

  const handleChangeCheckbox = (checkIndex) => {
    if (settingsScreens[checkIndex].check === true) {
      const dataScreen = settingsScreens.map((item) => {
        if (item.id === settingsScreens[checkIndex].id) {
          return { ...item, check: false }
        }
        return item
      })
      setSettingsScreens(dataScreen)
      dispatch(
        setNavigation({
          ...selectedNav,
          settingsScreen: dataScreen,
        }),
      )
    } else {
      const dataScreen = settingsScreens.map((item) => {
        if (item.id === settingsScreens[checkIndex].id) {
          return { ...item, check: true }
        }
        return item
      })

      dispatch(
        setNavigation({
          ...selectedNav,
          settingsScreen: dataScreen,
        }),
      )

      setSettingsScreens(dataScreen)
    }
  }

  const handleChangeAllCheckbox = (flag) => {
    const dataScreen = settingsScreens.map((item) => ({
      ...item,
      check: flag,
    }))

    dispatch(
      setNavigation({
        ...selectedNav,
        settingsScreen: dataScreen,
      }),
    )
    setSettingsScreens(dataScreen)
  }
  return (
    <React.Fragment>
      <>
        {' '}
        <CRow className="col-10">
          {true && (
            <>
              {settingsScreens.map((item, index) => (
                <CCol sm={3} key={index}>
                  <input
                    name={`r${index}`}
                    className="my-2 mx-1"
                    // value={item.name}
                    type="checkbox"
                    checked={item.check === true ? true : false}
                    defaultChecked={item.check === true ? true : false}
                    onChange={() => handleChangeCheckbox(index)}
                  />
                  <span>
                    {item.screen_name_en} {`(${index + 1})`}
                  </span>
                </CCol>
              ))}
            </>
          )}
        </CRow>
        <CRow className="col-10 my-3">
          <CCol sm={3}>
            <input
              name={`r`}
              className="my-2 mx-1"
              value={1}
              type="checkbox"
              defaultChecked={false}
              onChange={() => {
                handleChangeAllCheckbox(!checkAll), setCheckAll(!checkAll)
              }}
            />
            <span style={{ border: '1px solid', fontWeight: 'bold', padding: '2px' }}>
              Select All
            </span>
          </CCol>
        </CRow>
      </>
    </React.Fragment>
  )
}

export default Settings
