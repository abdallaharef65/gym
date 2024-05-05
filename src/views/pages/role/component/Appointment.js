/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { cleanupRoleScreen, setNavigation } from '../../../../redux/Reducer/roleReducer/roleSlice'

const Appointment = ({ screens, id }) => {

  
  const [appointmentScreens, setAppointmentScreens] = useState([])
  const [checkAll, setCheckAll] = useState(false)

  const selectedNav = useSelector((state) => state.rolesSlice.roleScreen)

  const dispatch = useDispatch()
  useEffect(() => {
    const dataScreen = screens.map((item) => ({
      ...item,
      check: id ? true : false,
      main_page: false,
    }))
    setAppointmentScreens(dataScreen)

    dispatch(
      setNavigation({
        ...selectedNav,
        AppointmentScreen: dataScreen,
      }),
    )
  }, [])
  // console.log(selectedNav)

  const handleChangeCheckbox = (checkIndex) => {
    if (appointmentScreens[checkIndex].check === true) {
      const dataScreen = appointmentScreens.map((item) => {
        if (item.id === appointmentScreens[checkIndex].id) {
          return { ...item, check: false }
        }
        return item
      })
      setAppointmentScreens(dataScreen)
    } else {
      const dataScreen = appointmentScreens.map((item) => {
        if (item.id === appointmentScreens[checkIndex].id) {
          return { ...item, check: true }
        }
        return item
      })

      dispatch(
        setNavigation({
          ...selectedNav,
          AppointmentScreen: dataScreen,
        }),
      )

      setAppointmentScreens(dataScreen)
    }
  }

  const handleChangeAllCheckbox = (flag) => {
    const dataScreen = appointmentScreens.map((item) => ({
      ...item,
      check: flag,
    }))

    dispatch(
      setNavigation({
        ...selectedNav,
        AppointmentScreen: dataScreen,
      }),
    )
    setAppointmentScreens(dataScreen)
  }



  return (
    <React.Fragment>
    <>
      {' '}
      <CRow className="col-10">
        {true && (
          <>
            {appointmentScreens.map((item, index) => (
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

export default Appointment
