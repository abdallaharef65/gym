/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { getData } from '../../../helper/index'
import ReactTable from '../../../components/common/table/ReactTable'
import HallModal from './modalForm'
import DeleteModal from '../../../components/common/deleteModal'
import { isAuthorizatoin } from '../../../utils/isAuthorization'
import { useNavigate } from 'react-router-dom'

const Holidays = () => {
  const navigate = useNavigate()

  const [dataHolidays, setDataHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleModale, setVisibleModale] = useState(false)
  const [reRenderData, setReRenderData] = useState(false)
  const [visibleDeleteModale, setVisibleDeleteModale] = useState(false)

  const [flagState, setFlagState] = useState(0)
  const [dataForEdit, setDataForEdit] = useState({})
  const [rowIdForDekete, setRowIdForDekete] = useState({})

  //test commit 1
  const columns = [
    {
      Header: 'id',
      accessor: 'id',
    },
    {
      Header: 'Hall Name',
      accessor: 'hall_name',
    },
    // {
    //   Header: 'Password',
    //   accessor: 'password',
    // },
    {
      Header: () => 'Color',
      accessor: 'color',
      Cell: ({ row }) => (
        <span style={{ width: '20px', height: '20px', backgroundColor: `${row.original.color}` }}>
          {row.original.color}
        </span>
      ),
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
            color="danger"
            className="me-3 text-white"
            onClick={() => {
              handleShowDeleteModal(row)
            }}
          >
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

  const handleShowDeleteModal = (row) => {
    setRowIdForDekete(row.original.id)
    setVisibleDeleteModale(true)
  }

  // check role
  useEffect(() => {
    const nav = isAuthorizatoin('holidays')
    if (nav) {
      navigate(nav)
    } else {
      handllerGetData()
    }
  }, [reRenderData])

  const handllerGetData = async () => {
    try {
      // Make a GET request to the API endpoint
      setLoading(true)

      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <React.Fragment>
      {loading ? (
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
              <h2>Holidays </h2>
            </CCol>
            <CCol sm={1}>
              <CButton
                color="success"
                className="me-3 text-white"
                onClick={() => {
                  setFlagState(1), handleAddData()
                }}
              >
                Add
              </CButton>
            </CCol>
          </CRow>

          <CRow>
            {/* <CRow>
              <ReactTable data={dataHolidays} columns={columns} />
            </CRow> */}
          </CRow>
        </>
      )}
    </React.Fragment>
  )
}

export default Holidays
