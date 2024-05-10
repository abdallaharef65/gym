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
  CToast,
  CToastBody,
} from '@coreui/react'
import { deleteDataByParam } from '../../helper/Api'

const DeleteModal = ({ visible, setVisible, Title, route, id, reRenderData, setReRenderData }) => {
  ////
  const [falgToast, setFalgToast] = useState(false)
  const [textToast, setTextToast] = useState('Saved successfully')
  const [colorToast, setColorToast] = useState('success')
  //CToast

  const saveData = async () => {
    if (true) {
      try {
        var res = await deleteDataByParam(route, id, 'id')
        console.log(res)
        if (res.success) {
          setFalgToast(true)
          setColorToast('success')
          setTextToast('Delete successfully')
          setReRenderData(!reRenderData)
          setTimeout(() => {
            setVisible(false)
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
          setVisible(false)
        }}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader
          onClose={() => {
            setVisible(false)
          }}
        >
          <CModalTitle id="LiveDemoExampleLabel">{`Delete ${Title}`}</CModalTitle>
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

        <React.Fragment>
          <CModalBody>
            <CRow>
              <CCol sm={12}> {`are you sure you want delete this ${Title} ? `}</CCol>
            </CRow>
          </CModalBody>
        </React.Fragment>

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false)
            }}
          >
            Close
          </CButton>
          <CButton color="primary" onClick={() => saveData()}>
            Delete{' '}
          </CButton>
        </CModalFooter>
      </CModal>
    </React.Fragment>
  )
}

export default DeleteModal
