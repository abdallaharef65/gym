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
import { HexColorPicker } from 'react-colorful'

const initialState = {
  id: null,
  hall_name: null,
  color: '#050005',
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

          //updateState
          if (flagState == 2) {
            setMainState((current) => ({
              ...current,
              id: dataForEdit.id,
              hall_name: dataForEdit.hall_name,
              color: dataForEdit.color,
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
    if (mainState.color && mainState.hall_name) {
      try {
        var bodyData = {
          hall_name: mainState.hall_name,
          color: mainState.color,
        }
        if (flagState == 1) {
          var res = await addData('halls', bodyData)
        } else {
          var res = await updateData(`halls`, mainState.id, bodyData)
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
        // size="lg"
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
            {flagState == 1 ? 'Add Hall' : 'Edit Hall'}
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
              <CRow className="mb-3">
                <CCol sm={12}>
                  <CFormInput
                    type="text"
                    id="HallName"
                    label="Hall Name"
                    defaultValue={mainState.hall_name}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        hall_name: e.target.value,
                      }))
                    }}
                  />
                  {falgValidation && !mainState.hall_name && (
                    <p style={{ color: 'red' }}>Required field</p>
                  )}
                </CCol>
                <CCol sm={6}></CCol>
              </CRow>
              <CRow>
                <CCol sm={8}>
                  <HexColorPicker
                    color={mainState.color}
                    onChange={(e) => setMainState((current) => ({ ...current, color: e }))}
                  />
                  {falgValidation && !mainState.color && (
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
