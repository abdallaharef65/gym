/* eslint-disable */

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'

function DeletePopup({
  title,
  message,
  handleDelete,
  handleDeleteAll,
  showToast,
  state,
  setState,
}) {
  const dispatch = useDispatch()
  const onClose = () => setState(!state)

  return (
    <>
      {/* <CModal
        size={'lg'}
        visible={state}
        onClose={() => setState(false)}
        className="border-1"
        style={{ borderColor: '#0C4C7D' }}
      > */}

      <CModal
        size="xl"
        // visible={visible}
        visible={state}
        onClose={() => setState(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <div>
          <CModalHeader onClose={onClose}>
            <CModalTitle>Delete Appointment</CModalTitle>
            {showToast && (
              <CToast
                autohide={false}
                visible={true}
                color="primary"
                className="text-white align-items-center"
              >
                <div className="d-flex">
                  <CToastBody>Deleted Successfully!</CToastBody>
                  <CToastClose className="me-2 m-auto" white />
                </div>
              </CToast>
            )}
          </CModalHeader>
          <CModalBody>{message}</CModalBody>
          <CModalFooter>
            <CButton color="dark" className="text-white" onClick={onClose}>
              Cancel
            </CButton>
            <CButton color="danger" className="text-white" onClick={handleDelete}>
              This appointment
            </CButton>
            <CButton color="danger" className="text-white" onClick={handleDeleteAll}>
              All appointments
            </CButton>
          </CModalFooter>
        </div>
      </CModal>
    </>
  )
}

export default DeletePopup
