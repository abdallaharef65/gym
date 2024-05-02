/* eslint-disable */
import React, { useEffect } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell } from '@coreui/icons'
import { DocsExample } from 'src/components'
import axios from 'axios'

const Buttons = () => {
  useEffect(() => {
    ;(async () => {
      try {
        // Make a GET request to the API endpoint
        const response = await axios.get('http://localhost:3001/bills')

        console.log(response)
        // Update state with the fetched data
        // setData(response.data);
        // setLoading(false);
      } catch (error) {
        // Handle errors
        // setError(error);
        // setLoading(false);
      }
    })()
  }, [])
  
  return (
    <React.Fragment>
    {/* <UsersModal
      setReRenderData={setReRenderData}
      reRenderData={reRenderData}
      visible={visibleModale}
      setVisible={setVisibleModale}
      flagState={flagState}
      setFlagState={setFlagState}
      dataForEdit={dataForEdit}
    />

    <DeleteModal
      visible={visibleDeleteModale}
      setVisible={setVisibleDeleteModale}
      setReRenderData={setReRenderData}
      reRenderData={reRenderData}
      Title={'user'}
      id={rowIdForDekete}
      flagState={flagState}
      setFlagState={setFlagState}
      dataForEdit={dataForEdit}
    /> */}

    {false ? (
      <CRow className="mt-5">
        <CCol sm={5}></CCol>
        <CCol sm={2}>
          <div className="loader"></div>
        </CCol>
        <CCol sm={5}></CCol>
      </CRow>
    ) : (
      <>
        <CRow>
          <CCol sm={11}>
            <h2>Calendar </h2>
          </CCol>
          <CCol sm={1}>
            <CButton
              color="success"
              className="me-3 text-white"
              // onClick={() => {
              //   setFlagState(1), handleAddData()
              // }}
            >
              Add
            </CButton>
          </CCol>
        </CRow>

        <CRow>
          <CRow>
            {/* <ReactTable data={dataUsers} columns={columns} /> */}
          </CRow>
        </CRow>
      </>
    )}
  </React.Fragment>
  )
}

export default Buttons
