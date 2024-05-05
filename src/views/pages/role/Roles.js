/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { getData } from '../../../helper/index'
import ReactTable from '../../../components/common/table/ReactTable'
import { useDispatch, useSelector } from 'react-redux'
import { setNavigation } from 'src/redux/Reducer/roleReducer/roleSlice'
import { useNavigate, Link } from 'react-router-dom'
const Role = () => {
  const dispatch = useDispatch()
  const [dataRoles, setDataRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [reRenderData, setReRenderData] = useState(false)

  const selectedNav = useSelector((state) => state.rolesSlice.roleScreen)
  console.log(selectedNav)
  useEffect(() => {
    ;(async () => {
      try {
        dispatch(
          setNavigation({
            ...selectedNav,
            AppointmentScreen: [{ id: 1 }],
          }),
        )
        // Make a GET request to the API endpoint
        setLoading(true)
        const res = await getData('role')
        setDataRoles(
          res.data.map((item) => ({
            ...item,
          })),
        )

        setTimeout(() => {
          setLoading(false)
        }, 500)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [reRenderData])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Role Name',
        accessor: 'role',
      },

      {
        Header: 'Options',
        accessor: 'index',
        Cell: ({ row }) => (
          <React.Fragment>
            <Link to={`/addrole?id=${row.original}`}>
              {' '}
              <CButton
                color="primary"
                className="me-3"
                onClick={() => {
                  console.log(row.original)
                }}
              >
                Edit
              </CButton>
            </Link>
          </React.Fragment>
        ),
      },
    ],
    [],
  )

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
              <h2>Role </h2>
            </CCol>
            <CCol sm={1}>
              <CButton
                color="success"
                className="me-3 text-white"
                // onClick={() => {
                //   setFlagState(1), handleAddData()
                // }}
              >
                <Link to={'/addrole'}>Add Role</Link>
              </CButton>
            </CCol>
          </CRow>

          <CRow>
            <ReactTable data={dataRoles} columns={columns} />
          </CRow>
        </>
      )}
    </React.Fragment>
  )
}

export default Role
