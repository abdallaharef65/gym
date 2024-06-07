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
import {
  FormLabel,
  Form,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap'
import { getData, addData, updateData, deleteDataByParam } from '../../../helper'
import { Controller, useForm } from 'react-hook-form'
import ReactSelect from 'react-select'
import { HexColorPicker } from 'react-colorful'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { addDays, format } from 'date-fns'
import DeletePopup from './DeletePopup'

const initialState = {
  id: null,
  appointments_start: null,
  appointments_end: null,
  appointments_date: null,
  hall_id: null,
  user_id: null,
  title: null,
  hall_name: null,
  user_name: null,
  backgroundColor: '#ffffff',
}
const CalendarForm = ({
  visible,
  setVisible,
  flagState,
  setFlagState,
  dataForEdit,
  reRenderData,
  setReRenderData,
  infoData,
}) => {
  const { handleSubmit, control } = useForm()

  //state
  const [mainState, setMainState] = useState(initialState)
  const [roleData, setRoleData] = useState([])
  const [dataUsers, setDataUsers] = useState([])
  const [dataHalls, setDataHalls] = useState([])

  const [loading, setLoading] = useState(true)
  const [falgValidation, setFalgValidation] = useState(false)
  ////
  const [falgToast, setFalgToast] = useState(false)
  const [flagReCurrent, setFlagReCurrent] = useState(false)
  const [flagReCurrentAgain, setFlagReCurrentAgain] = useState(false)

  const [textToast, setTextToast] = useState('Saved successfully')
  const [colorToast, setColorToast] = useState('success')
  const [errorMsg, setErrorMsg] = useState('')

  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const [selectedDays, setSelectedDays] = useState([])
  const [appsQtys, setAppsQtys] = useState([])
  const [showToast, setShowToast] = useState(false)

  const [visibleDeleteHall, setVisibleDeleteHall] = useState(false)
  const [toastColor, setToastColor] = useState('success')
  const [message, setMessage] = useState('تم الحفظ')

  const [weekdays, setWeekDays] = useState([
    { id: 6, label: 'Saturday' },
    { id: 0, label: 'Sunday' },
    { id: 1, label: 'Monday' },
    { id: 2, label: 'Tuesday' },
    { id: 3, label: 'Wednesday' },
    { id: 4, label: 'Thursday' },
    { id: 5, label: 'Friday' },
  ])
  //CToast

  function formatDate(isoString) {
    const date = new Date(isoString)

    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-indexed
    const day = String(date.getUTCDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    setAppsQtys([])
    if (flagState > 0) {
      ;(async () => {
        try {
          // Make a GET request to the API endpoint
          setLoading(true)
          const resUser = await getData('user')
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

          //updateState
          if (flagState == 2) {
            var startTime =
              formatDate(dataForEdit.appointments_date) + ' ' + dataForEdit.appointments_start
            var endTime =
              formatDate(dataForEdit.appointments_date) + ' ' + dataForEdit.appointments_end

            handleChangeEndDate(new Date(endTime))
            handleChangeStartDate(new Date(startTime))

            setMainState((current) => ({
              ...current,
              backgroundColor: dataForEdit.color,
              id: dataForEdit.id,
              hall_id: dataForEdit.hall_id,
              hall_name: dataForEdit.hall_name,
              color: dataForEdit.color,
              title: dataForEdit.title,
              appointments_date: dataForEdit.appointments_date,
              user_id: dataForEdit.user_id,
              user_name: dataForEdit.first_name + ' ' + dataForEdit.last_name,
            }))
          } else {
            handleChangeEndDate(new Date(infoData.end))
            handleChangeStartDate(new Date(infoData.start))
            setMainState({
              id: null,
              appointments_date: null,
              hall_id: null,
              user_id: null,
              title: null,
              hall_name: null,
              user_name: null,
            })
          }

          setTimeout(() => {
            setLoading(false)
          }, 1000)
        } catch (err) {}
      })()
    }
  }, [flagState])

  const saveData = async () => {
    setErrorMsg('')
    setFalgValidation(true)

    var res = false
    if (mainState.user_id && mainState.title && mainState.hall_id) {
      if (flagState == 2) {
        const bodyDataUpdate = {
          appointments_date: start,
          appointments_start: start.toLocaleTimeString('en-US', { hour12: false }),
          appointments_end: end.toLocaleTimeString('en-US', { hour12: false }),
          user_id: mainState.user_id,
          title: mainState.title,
          hall_id: mainState.hall_id,
        }
        var res = await updateData(`appointments`, mainState.id, bodyDataUpdate)
      } else {
        if (flagReCurrent) {
          var bodyDataBulk = []
          for (let i = 0; i < appsQtys.length; i++) {
            bodyDataBulk.push({
              appointments_end: appsQtys[i].endTime,
              appointments_start: appsQtys[i].startTime,
              appointments_date: appsQtys[i].appointmentDate,
              user_id: mainState.user_id,
              title: mainState.title,
              hall_id: mainState.hall_id,
            })
          }

          console.log(bodyDataBulk)
          if (flagReCurrentAgain && appsQtys.length > 0) {
            res = await addData('appointmentsbulk', bodyDataBulk)
          } else {
            setErrorMsg(
              'Please press the recurrent button and Make sure to choose a period that contains days',
            )
          }
        } else if (!flagReCurrent) {
          if (
            start.toISOString().split('T')[0] == end.toISOString().split('T')[0] &&
            start.toLocaleTimeString('en-US', { hour12: false }).slice(0, -2) <
              end.toLocaleTimeString('en-US', { hour12: false }).slice(0, -2)
          ) {
            const bodyDataBulk = {
              appointments_date: start,
              appointments_start: start.toLocaleTimeString('en-US', { hour12: false }),
              appointments_end: end.toLocaleTimeString('en-US', { hour12: false }),
              user_id: mainState.user_id,
              title: mainState.title,
              hall_id: mainState.hall_id,
            }
            res = await addData('appointments', bodyDataBulk)
          } else {
            setErrorMsg(
              'The start and end fields must be on the same day and with a time difference between the two fields',
            )
          }
        }
      }

      if (res ? res.data.success : false) {
        setFalgValidation(false)
        setFalgToast(true)
        setColorToast('success')
        setTextToast('Saved successfully')
        setReRenderData(!reRenderData)
        setTimeout(() => {
          setVisible(false), setFlagState(0)
        }, 3000)
      } else {
        if (res === false && false) {
          setErrorMsg('There is no data to add')
        } else {
          setFalgToast(true)
          setColorToast('danger')
          setTextToast('Error')
        }
      }
      setTimeout(() => {
        setFalgToast(false)
      }, 4000)
    }
  }

  const handleChangeStartDate = (date) => {
    if (date) {
      setFlagReCurrentAgain(false)
      setStart(new Date(date))
    }
  }

  const handleChangeEndDate = (date) => {
    if (date) {
      setFlagReCurrentAgain(false)
      setEnd(new Date(date))
    }
  }

  const calculateSchedule = (startDate, endDate, selectedDays) => {
    if (
      start.toISOString().split('T')[0] < end.toISOString().split('T')[0] &&
      start.toLocaleTimeString('en-US', { hour12: false }).slice(0, -2) <
        end.toLocaleTimeString('en-US', { hour12: false }).slice(0, -2)
    ) {
      if (startDate && endDate && selectedDays.length > 0) {
        let appointments = []
        let currentDate = startDate

        while (currentDate <= endDate) {
          if (selectedDays.includes(currentDate.getDay())) {
            appointments.push(new Date(currentDate)) // Make sure to clone the date object
          }
          currentDate = addDays(currentDate, 1)
        }

        // Map appointments to the desired object structure
        const formattedAppointments = appointments.map((date, index) => {
          const startTime = format(startDate, 'HH:mm:ss')
          const endTime = format(endDate, 'HH:mm:ss')
          return {
            id: index + 1,
            startDateselected: format(date, 'yyyy-MM-dd') + ' ' + startTime,
            endDateselected: format(date, 'yyyy-MM-dd') + ' ' + endTime,
            startTime,
            endTime,
            appointmentDate: format(date, 'yyyy-MM-dd'),
          }
        })
        setFlagReCurrentAgain(true)
        // Set the state with the formatted appointments
        setAppsQtys(formattedAppointments)
        setErrorMsg()
      } else {
        // Handle error condition
        // setErrorDateValue('The days must be chosen');
        setAppsQtys([]) // Set an empty array if there are no appointments
      }
    } else {
      setErrorMsg('The start field must be larger than the end field in time and date')
    }
  }

  const handleChangePeriod1 = (e, index) => {
    if (e) {
      const newAddList = [...appsQtys]
      newAddList[index] = {
        ...newAddList[index],
        startDateselected: format(e, 'yyyy-MM-dd HH:mm:ss'),
        startTime: format(e, 'HH:mm:ss'),
        appointmentDate: format(e, 'yyyy-MM-dd'),
      }
      setAppsQtys(newAddList)
    }
  }
  const handleChangePeriod2 = (e, index) => {
    if (e) {
      const newAddList = [...appsQtys]
      newAddList[index] = {
        ...newAddList[index],
        endDateselected: format(e, 'yyyy-MM-dd HH:mm:ss'),
        endTime: format(e, 'HH:mm:ss'),
        appointmentDate: format(e, 'yyyy-MM-dd'),
      }
      setAppsQtys(newAddList)
    }
  }

  const handleDeleteAppointment = (id) => {
    setAppsQtys(appsQtys.filter((x) => x.id != id))
  }

  const handleDelete = async () => {
    const resDelete = await deleteDataByParam('appointments', dataForEdit.id, 'id')
    if (resDelete.success == true) {
      setShowToast(true)
      setToastColor('success')
      setTimeout(() => {
        setShowToast(false)
        setReRenderData(!reRenderData)
        setVisibleDeleteHall(false)
        setVisible(false)
      }, 2000)
    } else {
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 4000)
      setToastColor('danger')
    }
  }

  const handleDeleteAll = async () => {
    const resDelete = await deleteDataByParam('appointments', dataForEdit.sharedid, 'sharedid')

    if (resDelete.success == true) {
      setShowToast(true)
      setToastColor('success')
      setTimeout(() => {
        setVisibleDeleteHall(false)
        setReRenderData(!reRenderData)
        setVisible(false)
        setShowToast(false)
      }, 2000)
    } else {
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 4000)
      setToastColor('danger')
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
            {flagState == 1 ? 'Add Calendar' : 'Edit Calendar'}
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
                <CCol sm={6}>
                  <CFormLabel>
                    Usres: <span className="text-danger">*</span>
                  </CFormLabel>
                  <ReactSelect
                    //mainState.user_id mainState.user_name
                    value={{ value: mainState.user_id, label: mainState.user_name }}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        user_id: e.value,
                        user_name: e.label,
                      }))
                    }}
                    options={dataUsers}
                    placeholder="Select a user"
                  />
                  {falgValidation && !mainState.user_id && (
                    <span className="text-danger">Required field</span>
                  )}
                </CCol>
                <CCol sm={6}>
                  <CFormLabel>
                    Title: <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="Title"
                    defaultValue={mainState.title}
                    onChange={(e) => {
                      setMainState((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }}
                  />
                  {falgValidation && !mainState.title && (
                    <span className="text-danger">Required field</span>
                  )}
                </CCol>
              </CRow>

              <div className="row mx-2 mt-2" style={{ zIndex: 9 }}>
                <div className="col p-0">
                  <div>
                    <Form.Label>Start</Form.Label>
                  </div>
                  <DatePicker
                    className="containeraref"
                    showTimeSelect
                    selected={start}
                    onChange={handleChangeStartDate}
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minTime={setHours(setMinutes(new Date(), 0), 8)}
                    maxTime={setHours(setMinutes(new Date(), 0), 22)}
                  />
                </div>
                <div className="col pe-0">
                  <div>
                    <Form.Label>End</Form.Label>
                  </div>

                  <DatePicker
                    // disabled={disabled}
                    className="containeraref"
                    showTimeSelect={true}
                    selected={end}
                    // includeDates={[new Date(start)]}
                    onChange={handleChangeEndDate}
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minTime={setHours(setMinutes(new Date(), 0), 8)}
                    maxTime={setHours(setMinutes(new Date(), 0), 22)}
                  />
                </div>
                <CCol>
                  <CFormLabel style={{ backgroundColor: `${mainState.backgroundColor}` }}>
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
              </div>

              <CRow className="mb-3">
                <CCol>
                  <Button
                    style={{ marginBottom: '-35px' }}
                    // type="radio"
                    disabled={flagState == 2}
                    className="mx-2"
                    variant={`primary`}
                    onClick={() => {
                      setFlagReCurrent(!flagReCurrent)
                    }}
                    autoComplete="off"
                  >
                    Recurrent
                  </Button>
                </CCol>
              </CRow>

              {flagReCurrent && flagState != 2 && (
                <>
                  <Row>
                    <CCol sm={9}>
                      <Form.Group className="mt-4">
                        <CFormLabel>Select Days</CFormLabel>
                        {weekdays.map((day) => (
                          <label className="mx-2">
                            <input
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
                      </Form.Group>
                    </CCol>
                    <CCol>
                      <Button
                        style={{ marginBottom: '-35px' }}
                        // type="radio"
                        className="mx-2"
                        variant={`primary`}
                        onClick={() => {
                          if (selectedDays.length > 0) {
                            calculateSchedule(new Date(start), new Date(end), selectedDays)
                          } else {
                            setErrorMsg('You must choose the days')
                          }
                        }}
                        autoComplete="off"
                      >
                        Recurrent
                      </Button>
                    </CCol>
                  </Row>

                  {appsQtys.length > 0 && (
                    <div style={{ zIndex: 7, maxHeight: '400px', overflowY: 'auto' }}>
                      {appsQtys.map((item, index) => (
                        <Row key={index}>
                          <Form.Label>Appointment - {index + 1}</Form.Label>
                          <div className="col-3">
                            <DatePicker
                              className="col-12 rounded p-1"
                              onChange={(e) => handleChangePeriod1(e, index)}
                              selected={item.startDateselected && new Date(item.startDateselected)}
                              showTimeSelect
                              required
                              timeIntervals={15}
                              placeholderText="Select Date and Time"
                              /*  timeCaption="Time" */
                              dateFormat="MMMM d, yyyy h:mm aa"
                              minTime={setHours(setMinutes(new Date(), 0), 8)}
                              maxTime={setHours(setMinutes(new Date(), 0), 22)}
                            />
                          </div>
                          <div className="col-3">
                            <DatePicker
                              className="col-12 rounded p-1"
                              onChange={(e) => handleChangePeriod2(e, index)}
                              selected={item.endDateselected && new Date(item.endDateselected)}
                              showTimeSelect
                              required
                              timeIntervals={15}
                              placeholderText="Select Date and Time"
                              /*  timeCaption="Time" */
                              dateFormat="MMMM d, yyyy h:mm aa"
                              minTime={setHours(setMinutes(new Date(), 0), 8)}
                              maxTime={setHours(setMinutes(new Date(), 0), 22)}
                            />
                          </div>
                          <Col>
                            <Button
                              // style={{ marginBottom: '-25px' }}
                              // type="radio"
                              className="mx-2"
                              variant={`primary`}
                              onClick={() => {
                                handleDeleteAppointment(item.id)
                              }}
                              autoComplete="off"
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </div>
                  )}
                </>
              )}

              <CRow className="mt-5">
                <CCol sm={6}>{<span className="text-danger">{errorMsg}</span>}</CCol>
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
          <CButton color="danger" className="text-white" onClick={() => setVisibleDeleteHall(true)}>
            Delete
          </CButton>
          <CButton color="primary" onClick={() => saveData()}>
            Save{' '}
          </CButton>
        </CModalFooter>
      </CModal>

      <DeletePopup
        state={visibleDeleteHall}
        setState={setVisibleDeleteHall}
        message={`Do you want to delete all appointments or the selected appointment?`}
        handleDelete={handleDelete}
        handleDeleteAll={handleDeleteAll}
        showToast={showToast}
      />
    </React.Fragment>
  )
}

export default CalendarForm
