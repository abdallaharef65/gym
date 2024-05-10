/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { cleanupRoleScreen, setNavigation } from '../../../../redux/Reducer/roleReducer/roleSlice'

const Coach = ({ screens, id }) => {
  const [coachScreen, setCoachScreen] = useState([])
  const [checkAll, setCheckAll] = useState(false)

  const selectedNav = useSelector((state) => state.rolesSlice.roleScreen)

  const dispatch = useDispatch()
  useEffect(() => {
    const dataScreen = screens.map((item) => ({
      ...item,
    }))
    setCoachScreen(dataScreen)
  }, [])

  const handleChangeCheckbox = (checkIndex) => {
    if (coachScreen[checkIndex].check === true) {
      const dataScreen = coachScreen.map((item) => {
        if (item.id === coachScreen[checkIndex].id) {
          return { ...item, check: false }
        }
        return item
      })
      dispatch(
        setNavigation({
          ...selectedNav,
          CoachScreen: dataScreen,
        }),
      )
      setCoachScreen(dataScreen)
    } else {
      const dataScreen = coachScreen.map((item) => {
        if (item.id === coachScreen[checkIndex].id) {
          return { ...item, check: true }
        }
        return item
      })

      dispatch(
        setNavigation({
          ...selectedNav,
          CoachScreen: dataScreen,
        }),
      )

      setCoachScreen(dataScreen)
    }
  }

  const handleChangeAllCheckbox = (flag) => {
    const dataScreen = coachScreen.map((item) => ({
      ...item,
      check: flag,
    }))

    dispatch(
      setNavigation({
        ...selectedNav,
        CoachScreen: dataScreen,
      }),
    )
    setCoachScreen(dataScreen)
  }

  return (
    <React.Fragment>
      <>
        {' '}
        <CRow className="col-10">
          {true && (
            <>
              {coachScreen.map((item, index) => (
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

export default Coach
