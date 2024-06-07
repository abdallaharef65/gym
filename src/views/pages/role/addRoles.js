/* eslint-disable */
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ReactSelect from 'react-select'
import AppointmentRoles from './component/Appointment'
import SettingsRoles from './component/settings'
import Coach from './component/Coach'
import { addData } from 'src/helper'
import {
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CButton,
  CFormInput,
  CToastBody,
  CToast,
} from '@coreui/react'
import { Tabs, Tab } from 'react-bootstrap'
import { deleteDataByParam, getData, selectDataByParam } from '../../../helper'
import { isAuthorizatoin } from '../../../utils/isAuthorization'

const AddRole = () => {
  const [searchParams] = useSearchParams()
  let id = searchParams.get('id')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  // check role
  useEffect(() => {
    const nav = isAuthorizatoin('role')
    nav && navigate(nav)
  }, [])
  const selectedNav = useSelector((state) => state.rolesSlice.roleScreen)

  const [activeKey, setActiveKey] = useState(1)
  const [selectedPages, setSelectedPages] = useState()
  const [roleName, setRoleName] = useState()
  const [mainPage, setMainPage] = useState({ value: null, label: null })
  const [validationField, setValidationField] = useState(false)
  const [allScreens, setAllScreens] = useState([])
  const [loadingPages, setLoadingPages] = useState(false)
  ////
  const [falgToast, setFalgToast] = useState(false)
  const [textToast, setTextToast] = useState('Saved successfully')
  const [colorToast, setColorToast] = useState('success')

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
        var resAllScreenScreens = await getData(`screens?limit=1000`)
        var resRoleScreens = []
        var checkresRoleScreens = false
        if (id) {
          checkresRoleScreens = true
          const paramRole = `id=${id}`
          const resRole = await selectDataByParam('role', paramRole)
          setMainPage({
            value: resRole.data[0].main_page_id,
            label: resRole.data[0].screen_name_en,
          })
          setRoleName(resRole.data[0].role)
          //main_page_id
          resRoleScreens = await getData(`role_screens?role_id=${id}`)

          //   setAllScreens(resRoleScreens.data)
        }

        setAllScreens(
          resAllScreenScreens.data.map((item) => ({
            ...item,
            check: checkresRoleScreens
              ? resRoleScreens.data.filter((x) => x.screen_id == item.id).length > 0
                ? true
                : false
              : false,
          })),
        )

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

  const onSubmit = async () => {}

  useEffect(() => {
    const selectedData = [
      ...selectedNav.mainScreens,
      ...selectedNav.settingsScreen,
      ...selectedNav.AppointmentScreen,
      ...selectedNav.CoachScreen,
    ].filter((x) => x.check == true)

    setSelectedPages(selectedData)

    if (selectedData.length == 0) {
      setMainPage({ value: null, label: null })
    } else if (mainPage.value) {
      if (selectedData.filter((v) => v.id == mainPage.value).length == 0) {
        setMainPage({ value: null, label: null })
      }
    }
  }, [
    selectedNav.mainScreens,
    selectedNav.settingsScreen,
    selectedNav.CoachScreen,
    selectedNav.AppointmentScreen,
  ])
  const handleChangeMainPage = (e) => {
    setMainPage(e)
  }

  const SaveRoleData = async () => {
    setValidationField(true)
    let tempArr = [
      ...selectedNav.AppointmentScreen,
      ...selectedNav.settingsScreen,
      ...selectedNav.CoachScreen,
    ].filter((x) => x.check == true)
    if (mainPage.value && roleName) {
      const bodyData = {
        id: id,
        role: roleName,
        main_page_id: mainPage.value,
        screens: tempArr.map((i) => i.id),
      }
      if (!id) {
        const { id, ...newObj } = bodyData

        var res = await addData('role_screens', newObj)
      } else {
        const deleteRole = await deleteDataByParam('role_screens', id, 'role_id')
        var res = await addData('role_screens', bodyData)
      }
      if (res.data.success) {
        setValidationField(false)
        setFalgToast(true)
        setColorToast('success')
        setTextToast('Saved successfully')
        setTimeout(() => {
          navigate('/role')
        }, 3000)
      } else {
        setFalgToast(true)
        setColorToast('danger')
        setTextToast('Error')
      }
      setTimeout(() => {
        setFalgToast(false)
      }, 4000)
    }
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

                {validationField && !roleName && <p style={{ color: 'red' }}>Required field</p>}
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
                  <SettingsRoles screens={allScreens} id={id} />
                </Tab>
                <Tab eventKey="2" title="Appointment ">
                  <AppointmentRoles
                    screens={allScreens.filter((x) => x.group_screen_id == 2)}
                    id={id}
                  />
                </Tab>
                <Tab eventKey="3" title="Teacher">
                  <Coach screens={allScreens.filter((x) => x.group_screen_id == 4)} id={id} />
                </Tab>
              </Tabs>
            </div>
            <CRow className="my-5">
              <CCol sm={6}>
                <CFormLabel>Home screen for this role</CFormLabel>
                {selectedPages && (
                  <>
                    <Controller
                      name=""
                      id=""
                      // rules={{ required: true }}
                      value={mainPage}
                      control={control}
                      render={({ field: { onChange } }) => (
                        <ReactSelect
                          value={mainPage}
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
                  </>
                )}
                {validationField && !mainPage.value && (
                  <p style={{ color: 'red' }}>Required field</p>
                )}
              </CCol>
            </CRow>

            <CRow className="mx-3 my-5">
              <CCol sm="auto">
                <CButton
                  onClick={() => SaveRoleData()}
                  style={{
                    color: 'white',
                  }}
                  color="success"
                  type="submit"
                >
                  Save
                </CButton>
              </CCol>
              <CCol sm="auto">
                <CButton
                  color="secondary"
                  onClick={() => {
                    navigate('/role')
                  }}
                >
                  Cancel
                </CButton>
              </CCol>
            </CRow>
            <CRow>
              <CToast
                className="mx-2"
                animation={false}
                autohide={false}
                visible={falgToast}
                color={colorToast}
              >
                <CToastBody>{textToast}</CToastBody>
              </CToast>
            </CRow>
          </>
        )}
      </CForm>
    </div>
  )
}

export default AddRole
