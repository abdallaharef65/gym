/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { getData } from '../../../helper/index'
import ReactTable from '../../../components/common/table/ReactTable'
import UsersModal from './modalForm'

const Users = () => {
  const [dataUsers, setDataUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleModale, setVisibleModale] = useState(false)
  const [flagState, setFlagState] = useState(0)
  const [dataForEdit, setDataForEdit] = useState({})

  //test commit
  const columns = [
    {
      Header: 'id',
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Password',
      accessor: 'password',
    },
    {
      Header: 'Phone',
      accessor: 'phone',
    },
    {
      Header: 'Role',
      accessor: 'role',
    },

    {
      Header: () => 'Options',
      accessor: 'index',
      Cell: ({ row }) => (
        <React.Fragment>
          <CButton
            color="primary"
            className="me-3"
            onClick={() => {
              setFlagState(2), handleEditData(row)
            }}
          >
            Edit
          </CButton>
          <CButton
            color="success"
            className="me-3"
            onClick={() => {
              setFlagState(1), handleAddData()
            }}
          >
            Add
          </CButton>
          <CButton color="success" className="me-3">
            Delete
          </CButton>
        </React.Fragment>
      ),
    },
  ]
  const handleAddData = () => {
    setVisibleModale(true)
  }
  const handleEditData = (row) => {
    setDataForEdit(row.original)
    setVisibleModale(true)
  }
  useEffect(() => {
    ;(async () => {
      try {
        // Make a GET request to the API endpoint
        setLoading(true)
        const res = await getData('user')
        console.log(res.data)

        setDataUsers(
          res.data.map((item) => ({
            ...item,
            name: item.first_name + ' ' + item.last_name,
          })),
        )

        setTimeout(() => {
          setLoading(false)
        }, 2000)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])
  return (
    <React.Fragment>
      <UsersModal
        visible={visibleModale}
        setVisible={setVisibleModale}
        flagState={flagState}
        setFlagState={setFlagState}
        dataForEdit={dataForEdit}
      />
      {loading ? (
        <CRow className="mt-5">
          <CCol sm={5}></CCol>
          <CCol sm={2}>
            <div className="loader"></div>
          </CCol>
          <CCol sm={5}></CCol>
        </CRow>
      ) : (
        <CRow>
          <CCol xs={12}>
            <h2>Users </h2>
          </CCol>
          <CRow>
            <ReactTable data={dataUsers} columns={columns} />
          </CRow>
        </CRow>
      )}
    </React.Fragment>
  )
}

export default Users
