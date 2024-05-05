/* eslint-disable */
import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
// import { CTabs, CTabContent, CTabPane, CNav, CNavItem, CNavLink } from '@coreui/react';

import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ReactSelect from 'react-select'
// import GeneralRoles from './component/GeneralRoles'
import AppointmentRoles from './component/Appointment'
import SettingsRoles from './component/settings'
import MainScreensRoles from './component/mainScreens'

import { addData } from 'src/helper'
import { cleanupRoleScreen, setNavigation } from '../../../redux/Reducer/roleReducer/roleSlice'
import { CForm, CRow, CCol, CFormLabel, CButton, CFormInput } from '@coreui/react'
import { Tabs, Tab } from 'react-bootstrap'
import { getData } from '../../../helper'
import { Link } from 'react-router-dom'
//src/redux/Reducer/roleReducer/roleSlice
// import { cleanupReadDataFlag } from 'src/redux/Reducer/StorageDataForEditRoleReducer/StorageDataForEditRoleReducerFlagSlice'
// import { addData } from 'src/helper'

const AddRole = () => {
  const [searchParams] = useSearchParams()
  let id = searchParams.get('id')
  console.log(id)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeKey, setActiveKey] = useState(1)
  const [selectedPages, setSelectedPages] = useState()
  console.log(selectedPages)
  const [roleName, setRoleName] = useState()
  const [mainPage, setMainPage] = useState()
  const [disableButton, setDisableButton] = useState(false)
  const [toastText, setToastText] = useState(null)
  const [toast, addToast] = useState(false)
  const [num, setNum] = useState()
  const [selectedMainPage, setSelectedMainPage] = useState()
  const [allScreens, setAllScreens] = useState([])
  const [loadingPages, setLoadingPages] = useState(false)
  const selectedNav = useSelector((state) => state.rolesSlice.roleScreen)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    ;(async () => {
      try {
        setLoadingPages(false)

        var resRoleScreens = await getData('screens')
        setAllScreens(resRoleScreens.data)

        setTimeout(() => {
          setLoadingPages(true)
        }, 1500)
      } catch (error) {
        console.error(error.message)
        if (error.message.includes('401')) {
          dispatch(showTokenModal({ showModal: true }))
        }
      }
    })()
  }, [])

  const onSubmit = async () => {
    // setDisableButton(true)
    // setToastText(null)
    // addToast(false)
    // let tempArr = [
    //   ...selectedNav.AppointmentScreen,
    //   ...selectedNav.DoctorScreen,
    //   ...selectedNav.FinancialScreen,
    //   ...selectedNav.GeneralScreen,
    //   ...selectedNav.ItemScreen,
    //   ...selectedNav.ScheduleScreen,
    //   ...selectedNav.ServiceScreen,
    //   ...selectedNav.SettingScreen,
    //   ...selectedNav.PatientScreen,
    // ]
    // // const screens = tempArr.map((i) => i.id)
    // const bodyData = {
    //   role: roleName,
    //   main_page_id: mainPage,
    //   screens: tempArr.map((i) => i.id),
    // }
    // try {
    //   const res = await addData('role_screens', bodyData)
    //   addToast(true)
    //   setToastText('Add Done Successfully')
    //   setTimeout(async () => {
    //     navigate(-1)
    //   }, 1500)
    // } catch (err) {
    //   console.error(err.message)
    //   if (err.message.includes('401')) {
    //     dispatch(showTokenModal({ showModal: true }))
    //   }
    // }
    // setDisableButton(false)
  }
  //   useEffect(() => {
  //     dispatch(cleanupRoleScreen())
  //     const nav = isAuthorizatoin('/roles')
  //     nav && navigate(nav)
  //   }, [])
  useEffect(() => {
    setSelectedPages([
      ...selectedNav.mainScreens,
      ...selectedNav.settingsScreen,
      ...selectedNav.AppointmentScreen,
    ])
  }, [selectedNav])
  // useEffect(() => {
  //   dispatch(cleanupRoleScreen())
  // }, [])
  const handleChangeMainPage = (e) => {
    setMainPage(e.value)
  }
  return (
    <div>
      <CForm onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {!loadingPages ? (
          <CRow className="mt-5">
            <CCol sm={5}></CCol>
            <CCol sm={2}>
              <div className="loader"></div>
            </CCol>
            <CCol sm={5}></CCol>
          </CRow>
        ) : (
          <>
            <CRow className="col-12 mb-4">
              <CFormLabel>
                Role Name: <span className="text-danger">*</span>
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput
                  type="text"
                  id="RoleName"
                  defaultValue={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CFormLabel className="my-4">Role Items</CFormLabel>
            </CRow>
            <div className="px-3">
              <Tabs
                id="controlled-tab-example"
                activeKey={activeKey}
                onSelect={(k) => setActiveKey(k)}
                className="mb-3"
              >
                <Tab eventKey="1" title="Settings">
                  <SettingsRoles
                    screens={allScreens.filter((x) => x.group_screen_id == 3)}
                    id={id}
                  />
                </Tab>
                <Tab eventKey="2" title="Appointment ">
                  <AppointmentRoles
                    screens={allScreens.filter((x) => x.group_screen_id == 2)}
                    id={id}
                  />
                </Tab>
                <Tab eventKey="3" title="Main Screens">
                  <MainScreensRoles
                    screens={allScreens.filter((x) => x.group_screen_id == 1)}
                    id={id}
                  />
                </Tab>
              </Tabs>
            </div>
            <CRow className="my-5">
              <CCol sm={6}>
                <CFormLabel>الشاشة الرئيسية لهذا الدور</CFormLabel>
                {selectedPages && (
                  <>
                    <Controller
                      name=""
                      id=""
                      // rules={{ required: true }}
                      defaultValue={mainPage}
                      control={control}
                      render={({ field: { onChange } }) => (
                        <ReactSelect
                          defaultValue={mainPage}
                          // placeholder="اختر ..... "
                          options={selectedPages.map((item) => ({
                            value: item.id,
                            label: item.screen_name_en,
                          }))}
                          onChange={(e) => {
                            handleChangeMainPage(e)
                          }}
                        />
                      )}
                    />
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      style={{ opacity: 0, height: 0, position: 'absolute' }}
                      defaultValue={mainPage ? mainPage : ''}
                      required
                    />
                  </>
                )}
              </CCol>
            </CRow>
            {/* <Toast className="m-2 " autohide={false} show={toast} bg="success">
          <div className="d-flex">
            <Toast.Body>{toastText}</Toast.Body>
          </div>
        </Toast>

        <Row className="mx-3 my-5">
          <Col sm="auto">
            <Button variant="success" type="submit" disabled={disableButton}>
              save
            </Button>
          </Col>
          <Col sm="auto">
            <Button
              disabled={disableButton}
              variant="secondary"
              onClick={() => {
                navigate(-1)
              }}
            >
              cancel
            </Button>
          </Col>
        </Row> */}{' '}
          </>
        )}
      </CForm>
    </div>
  )
}

export default AddRole
