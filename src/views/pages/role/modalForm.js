/* eslint-disable */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalFooter,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CRow,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react'
import { getData, addData, updateData } from '../../../helper'
import { Controller, useForm } from 'react-hook-form'
import ReactSelect from 'react-select'

const initialState = {
  first_name: null,
  last_name: null,
  email: null,
  phone: null,
  password: null,
  role: null,
  role_id: null,
  id: null,
}
const UsersModal = ({
  visible,
  setVisible,
  flagState,
  setFlagState,
  dataForEdit,
  reRenderData,
  setReRenderData,
}) => {
  const { handleSubmit, control } = useForm()

  //state
  const [mainState, setMainState] = useState(initialState)
  const [roleData, setRoleData] = useState([])
  const [loading, setLoading] = useState(true)
  const [falgValidation, setFalgValidation] = useState(false)
  ////
  const [falgToast, setFalgToast] = useState(false)
  const [textToast, setTextToast] = useState('Saved successfully')
  const [colorToast, setColorToast] = useState('success')
  //CToast
  useEffect(() => {
    if (flagState > 0) {
      ;(async () => {
        try {
          // Make a GET request to the API endpoint
          setLoading(true)
          const res = await getData('role')

          setRoleData(
            res.data.map((item) => ({
              ...item,
              value: item.id,
              label: item.role,
            })),
          )

          if (flagState == 2) {
            setMainState((current) => ({
              ...current,
              id: dataForEdit.id,
              first_name: dataForEdit.first_name,
              last_name: dataForEdit.last_name,
              email: dataForEdit.email,
              phone: dataForEdit.phone,
              password: dataForEdit.password,
              role: dataForEdit.role,
              role_id: dataForEdit.role_id,
            }))
          } else {
            setMainState(initialState)
          }

          setTimeout(() => {
            setLoading(false)
          }, 1000)
        } catch (err) {
          console.log(err)
        }
      })()
    }
  }, [flagState])
  const saveData = async () => {
    setFalgValidation(true)
    if (
      mainState.role_id &&
      mainState.password &&
      mainState.phone &&
      mainState.email &&
      mainState.last_name &&
      mainState.first_name
    ) {
      try {
        var bodyData = {
          role_id: mainState.role_id,
          password: mainState.password,
          phone: mainState.phone,
          email: mainState.email,
          last_name: mainState.last_name,
          first_name: mainState.first_name,
        }
        if (flagState == 1) {
          var res = await addData('user', bodyData)
        } else {
          var res = await updateData(`user`, mainState.id, bodyData)
        }
        if (res.data.success) {
          setFalgValidation(false)
          setFalgToast(true)
          setColorToast('success')
          setTextToast('Saved successfully')
          setReRenderData(!reRenderData)
          setTimeout(() => {
            setVisible(false), setFlagState(0)
          }, 3000)
        } else {
          setFalgToast(true)
          setColorToast('danger')
          setTextToast('Error')
        }
        setTimeout(() => {
          setFalgToast(false)
        }, 4000)
      } catch (err) {
        console.log(err)
      }
    }
  }
  return (
    <React.Fragment>
      <CModal
        size="xl"
        visible={visible}
        onClose={() => {
          setVisible(false), setFlagState(0)
        }}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader
          onClose={() => {
            setVisible(false), setFlagState(0)
          }}
        >
          <CModalTitle id="LiveDemoExampleLabel">
            {flagState == 1 ? 'Add User' : 'Edit User'}
          </CModalTitle>
          <CToast
            className="mx-2"
            animation={false}
            autohide={false}
            visible={falgToast}
            color={colorToast}
          >
            <CToastBody>{textToast}</CToastBody>
          </CToast>
        </CModalHeader>
        {loading ? (
          <CRow className="mt-5">
            <CCol sm={5}></CCol>
            <CCol sm={2}>
              <div className="loader"></div>
            </CCol>
            <CCol sm={5}></CCol>
          </CRow>
        ) : (
          <React.Fragment>
            <CModalBody>
              <CRow>
                <CCol sm={6}>
                  <CFormInput
                    type="text"
                    id="FirstName"
                    label="First Name"
                    defaultValue={mainState.first_name}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        first_name: e.target.value,
                      }))
                    }}
                  />
                  {falgValidation && !mainState.first_name && (
                    <p style={{ color: 'red' }}>Required field</p>
                  )}
                </CCol>
                <CCol sm={6}>
                  <CFormInput
                    type="text"
                    id="FirstName"
                    label="Last Name"
                    defaultValue={mainState.last_name}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        last_name: e.target.value,
                      }))
                    }}
                  />
                  {falgValidation && !mainState.last_name && (
                    <p style={{ color: 'red' }}>Required field</p>
                  )}
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={6}>
                  <CFormInput
                    type="phone"
                    id="phone"
                    label="Phone"
                    defaultValue={mainState.phone}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        phone: e.target.value,
                      }))
                    }}
                  />
                  {falgValidation && !mainState.phone && (
                    <p style={{ color: 'red' }}>Required field</p>
                  )}
                </CCol>
                <CCol sm={6}>
                  <CFormInput
                    type="email"
                    id="email"
                    label="Email"
                    defaultValue={mainState.email}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        email: e.target.value,
                      }))
                    }}
                  />
                  {falgValidation && !mainState.email && (
                    <p style={{ color: 'red' }}>Required field</p>
                  )}
                </CCol>
              </CRow>
              <CRow className="mt-2">
                <CCol sm={6}>
                  <CFormLabel> Role</CFormLabel>
                  <ReactSelect
                    isClearable
                    value={{ value: mainState.role_id, label: mainState.role }}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        role_id: e ? e.value : null,
                        role: e ? e.label : null,
                      }))
                    }}
                    options={roleData}
                    placeholder="Select a fruit"
                  />
                  {falgValidation && !mainState.role_id && (
                    <p style={{ color: 'red' }}>Required field</p>
                  )}
                </CCol>
                <CCol sm={6}>
                  <CFormInput
                    type="text"
                    id="pass"
                    label="Password"
                    defaultValue={mainState.password}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        password: e.target.value,
                      }))
                    }}
                  />
                  {falgValidation && !mainState.password && (
                    <p style={{ color: 'red' }}>Required field</p>
                  )}
                </CCol>
              </CRow>
            </CModalBody>
          </React.Fragment>
        )}

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false), setFlagState(0)
            }}
          >
            Close
          </CButton>
          <CButton color="primary" onClick={() => saveData()}>
            Save{' '}
          </CButton>
        </CModalFooter>
      </CModal>
    </React.Fragment>
  )
}

export default UsersModal
