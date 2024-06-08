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
import { getData, addData, updateData, selectDataByParam } from '../../../helper'
import { Controller, useForm } from 'react-hook-form'
import ReactSelect from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { setHours, setMinutes, setSeconds } from 'date-fns'

// Initial state for the modal
const initialState = {
  id: null,
  teacher_id: null,
  teacher_name: null,
  hall_id: null,
  hall_name: null,
  end_time: setHours(setMinutes(setSeconds(new Date(), 0), 30), 8), // 08:30:00
  begin_time: setHours(setMinutes(setSeconds(new Date(), 0), 0), 8), // 08:00:00
  course_name: null,
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

  // State variables
  const [mainState, setMainState] = useState(initialState)
  const [roleData, setRoleData] = useState([])
  const [loading, setLoading] = useState(true)
  const [falgValidation, setFalgValidation] = useState(false)
  const [dataUsers, setDataUsers] = useState([])
  const [dataHalls, setDataHalls] = useState([])
  const [falgToast, setFalgToast] = useState(false)
  const [textToast, setTextToast] = useState('Saved successfully')
  const [colorToast, setColorToast] = useState('success')
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedDays, setSelectedDays] = useState([])

  const [weekdays, setWeekDays] = useState([
    { id: 6, label: 'Saturday' },
    { id: 0, label: 'Sunday' },
    { id: 1, label: 'Monday' },
    { id: 2, label: 'Tuesday' },
    { id: 3, label: 'Wednesday' },
    { id: 4, label: 'Thursday' },
    { id: 5, label: 'Friday' },
  ])

  // Fetch data and initialize modal
  useEffect(() => {
    if (flagState > 0) {
      setFalgValidation(false)
      setErrorMsg('')
      ;(async () => {
        try {
          // Make a GET request to the API endpoint
          setLoading(true)
          // const resUser = await getData('user')
          const param = `role_id=${2}`
          let resUser = await selectDataByParam('user', param)
          setDataUsers(
            resUser.data.map((item) => ({
              ...item,
              value: item.id,
              label: item.first_name + ' ' + item.last_name,
            })),
          )

          const resHalls = await getData('halls')
          setDataHalls(
            resHalls.data.map((item) => ({
              ...item,
              value: item.id,
              label: item.hall_name,
            })),
          )
          setSelectedDays([])

          // Update state if editing
          if (flagState == 2) {
            setMainState((current) => ({
              ...current,
              id: dataForEdit.id,
              course_name: dataForEdit.course_name,
              hall_id: dataForEdit.hall_id,
              hall_name: dataForEdit.hall_name,
              teacher_id: dataForEdit.teacher_id,
              teacher_name: dataForEdit.teacher_name,
              end_time: setTimeFromString(dataForEdit.end_time),
              begin_time: setTimeFromString(dataForEdit.begin_time),
            }))
            setSelectedDays(dataForEdit.days)
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

  // Function to set time from string
  const setTimeFromString = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number)
    const now = new Date()
    now.setHours(hours, minutes, seconds, 0) // Set the time, with milliseconds set to 0
    return now
  }

  // Function to get time in 24-hour format
  const getTimeIn24HourFormat = (dateString) => {
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  // Function to save data
  const saveData = async () => {
    setErrorMsg('')
    setFalgValidation(true)
    if (
      mainState.course_name &&
      mainState.begin_time &&
      mainState.end_time &&
      mainState.hall_id &&
      mainState.teacher_id &&
      selectedDays.length > 0
    ) {
      if (mainState.begin_time < mainState.end_time) {
        try {
          var bodyData = {
            begin_time: getTimeIn24HourFormat(mainState.begin_time),
            end_time: getTimeIn24HourFormat(mainState.end_time),
            hall_id: mainState.hall_id,
            teacher_id: mainState.teacher_id,
            course_name: mainState.course_name,
            days: selectedDays,
          }

          if (flagState == 1) {
            var res = await addData('courses', bodyData)
          } else {
            var res = await updateData(`courses`, mainState.id, bodyData)
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
      } else {
        setErrorMsg('The start time of the lecture must be before the end time')
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
            {flagState == 1 ? 'Add Course' : 'Edit Course'}
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
                <CCol>
                  <CFormLabel>
                    Course name: <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="coursename"
                    defaultValue={mainState.course_name}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        course_name: e.target.value,
                      }))
                    }}
                  />
                  {falgValidation && !mainState.course_name && (
                    <p style={{ color: 'red' }}>Required field</p>
                  )}
                </CCol>
                <CCol>
                  <CFormLabel>
                    Teacher: <span className="text-danger">*</span>
                  </CFormLabel>
                  <ReactSelect
                    value={{ value: mainState.teacher_id, label: mainState.teacher_name }}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        teacher_id: e.value,
                        teacher_name: e.label,
                      }))
                    }}
                    options={dataUsers}
                    placeholder="Select a user"
                  />
                  {falgValidation && !mainState.teacher_id && (
                    <span className="text-danger">Required field</span>
                  )}
                </CCol>
                <CCol>
                  <CFormLabel>
                    Halls: <span className="text-danger">*</span>
                  </CFormLabel>
                  <ReactSelect
                    value={{ value: mainState.hall_id, label: mainState.hall_name }}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        backgroundColor: e.color,
                        hall_id: e.value,
                        hall_name: e.label,
                      }))
                    }}
                    options={dataHalls}
                    placeholder="Select a halls"
                  />
                  {falgValidation && !mainState.hall_id && (
                    <span className="text-danger">Required field</span>
                  )}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={3}>
                  <CFormLabel>
                    Start Time: <span className="text-danger">*</span>
                  </CFormLabel>
                  <div>
                    <DatePicker
                      required
                      selected={mainState.begin_time}
                      onChange={(e) => {
                        setMainState((current) => ({
                          ...current,
                          begin_time: e,
                        }))
                      }}
                      showTimeSelect
                      showTimeSelectOnly
                      minTime={setHours(setMinutes(0, 0), 8)}
                      maxTime={setHours(setMinutes(0, 0), 16)}
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                    />
                  </div>
                  {falgValidation && !mainState.begin_time && (
                    <span className="text-danger">Required field</span>
                  )}
                </CCol>
                <CCol sm={3}>
                  <CFormLabel>
                    End Time: <span className="text-danger">*</span>
                  </CFormLabel>
                  <div>
                    <DatePicker
                      required
                      selected={mainState.end_time}
                      onChange={(e) => {
                        setMainState((current) => ({
                          ...current,
                          end_time: e,
                        }))
                      }}
                      showTimeSelect
                      showTimeSelectOnly
                      minTime={setHours(setMinutes(new Date(), 0), 8)}
                      maxTime={setHours(setMinutes(new Date(), 0), 18)}
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                    />
                  </div>
                  {falgValidation && !mainState.end_time && (
                    <span className="text-danger">Required field</span>
                  )}
                </CCol>
                <CCol sm={9} className="mt-3">
                  <CFormLabel>Select Days</CFormLabel>
                  {weekdays.map((day) => (
                    <label className="mx-2 ">
                      <input
                        checked={selectedDays.filter((x) => x == day.id).length > 0 ? true : false}
                        type="checkbox"
                        onChange={(e) => {
                          e.target.checked
                            ? setSelectedDays((prev) => [...prev, day.id])
                            : setSelectedDays((prev) => prev.filter((i) => i != day.id))
                        }}
                      />{' '}
                      {day.label}
                    </label>
                  ))}
                </CCol>
                {falgValidation && selectedDays.length == 0 && (
                  <span className="text-danger">Required field</span>
                )}
              </CRow>
              {<span className="text-danger">{errorMsg}</span>}
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
