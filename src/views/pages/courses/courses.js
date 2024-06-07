/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { getData } from '../../../helper/index'
import ReactTable from '../../../components/common/table/ReactTable'
import CoursesModal from './modalForm'
import DeleteModal from '../../../components/common/deleteModal'
import { isAuthorizatoin } from '../../../utils/isAuthorization'
import { useNavigate } from 'react-router-dom'

const Courses = () => {
  const navigate = useNavigate()

  const [dataCourses, setDataCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleModale, setVisibleModale] = useState(false)
  const [reRenderData, setReRenderData] = useState(false)
  const [visibleDeleteModale, setVisibleDeleteModale] = useState(false)

  const [flagState, setFlagState] = useState(0)
  const [dataForEdit, setDataForEdit] = useState({})
  const [rowIdForDekete, setRowIdForDekete] = useState({})

  const [weekdays, setWeekDays] = useState([
    { id: 6, label: 'Saturday' },
    { id: 0, label: 'Sunday' },
    { id: 1, label: 'Monday' },
    { id: 2, label: 'Tuesday' },
    { id: 3, label: 'Wednesday' },
    { id: 4, label: 'Thursday' },
    { id: 5, label: 'Friday' },
  ])

  //test commit 1
  const columns = [
    {
      Header: 'Id',
      accessor: 'id',
    },
    {
      Header: 'Teacher',
      accessor: 'teacher_name',
    },

    {
      Header: 'Course name',
      accessor: 'course_name',
    },
    {
      Header: 'Hall',
      accessor: 'hall_name',
    },
    {
      Header: 'Days',
      accessor: 'dayText',
    },

    {
      Header: 'Tims',
      accessor: 'time',
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
  const DayText = (days) => {
    // console.log('i am here')
    var day = ''
    for (let i = 0; i < days.length; i++) {
      day += weekdays.filter((x) => x.id == days[i])[0].label + ',' + ' '
    }

    return day
  }

  // check role
  useEffect(() => {
    const nav = isAuthorizatoin('courses')
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
      const res = await getData('courses')

      setDataCourses(
        res.data.map((item) => ({
          ...item,
          dayText: DayText(item.days),
          teacher_name: item.first_name + ' ' + item.last_name,
          time: item.begin_time + ' - ' + item.end_time,
        })),
      )

      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <React.Fragment>
      <CoursesModal
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
        Title={'Course'}
        route={'courses'}
        id={rowIdForDekete}
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
        <>
          <CRow>
            <CCol sm={11}>
              <h2>Courses </h2>
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
            <CRow>
              <ReactTable data={dataCourses} columns={columns} />
            </CRow>
          </CRow>
        </>
      )}
    </React.Fragment>
  )
}

export default Courses
