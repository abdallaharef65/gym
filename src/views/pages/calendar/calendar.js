/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { getData, selectDataByParam } from '../../../helper/index'
import { isAuthorizatoin } from '../../../utils/isAuthorization'
import { useNavigate } from 'react-router-dom'
//Calendar
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'

import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import ReactSelect from 'react-select'
import CalendarForm from './calendarForm'

const Calendar = () => {
  const navigate = useNavigate()

  const [usersSelect, setUsersSelect] = useState([])
  const [usersResources, setUsersResources] = useState([])

  const [usersData, setUsersData] = useState({
    value: null,
    label: null,
  })

  const [events, setEvents] = useState([])

  const [loading, setLoading] = useState(true)
  const [visibleModale, setVisibleModale] = useState(false)
  const [reRenderData, setReRenderData] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState({
    start: null,
    end: null,
  })

  const [flagState, setFlagState] = useState(0)
  const [dataForEdit, setDataForEdit] = useState({})

  const convertDatetime = (originalDatetime) => {
    // Extract the year, month, and day from the original datetime string
    const [datePart, timePart] = originalDatetime.split(' ')
    const [year, month, day] = datePart.split('-')

    // Rearrange the date parts and add the 'T' separator
    const isoDatetime = `${year}-${month}-${day}T${timePart}`

    return isoDatetime
  }

  function formatDate(isoString) {
    const date = new Date(isoString)

    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-indexed
    const day = String(date.getUTCDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // check role
  useEffect(() => {
    const nav = isAuthorizatoin('calendar')
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

      let user = await getData('user')
      let USelect = user.data.map((e) => ({
        value: e.id,
        label: e.first_name + ' ' + e.last_name,
      }))
      setUsersSelect([{ value: -1, label: 'Select All' }, ...USelect])

      setUsersData({
        value: user.data[0].id,
        label: user.data[0].first_name + ' ' + user.data[0].last_name,
      })
      setUsersResources([
        {
          id: user.data[0].id,
          title: user.data[0].first_name + ' ' + user.data[0].last_name,
        },
      ])

      const param = `user_id=${user.data[0].id}`
      let res = await selectDataByParam('appointments', param)
      //user.data[0].id
      var filterData = []
      filterData.push(
        ...res.data.map((item, index) => ({
          title: item.title,
          start: convertDatetime(
            `${formatDate(item.appointments_date)} ${item.appointments_start}`,
          ),
          end: convertDatetime(`${formatDate(item.appointments_date)} ${item.appointments_end}`),
          color: item.color,
          publicId: item.id,
          resourceId: item.user_id,
        })),
      )

      setEvents(filterData)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSelected = async (info) => {
    if (info.view.type === 'resourceTimeGridDay') {
      setSelectedInfo({
        start: info.start,
        end: info.end,
      })
    } else {
      setSelectedInfo({
        start: info.start,
        end: info.end,
      })
    }

    setFlagState(1)
    setVisibleModale(true)
  }

  const handleChangeUsers = async (e) => {
    if (e.value != -1) {
      const param = `user_id=${e.value}`
      let res = await selectDataByParam('appointments', param)
      var filterData = []
      filterData.push(
        ...res.data.map((item) => ({
          title: item.title,
          start: convertDatetime(
            `${formatDate(item.appointments_date)} ${item.appointments_start}`,
          ),
          end: convertDatetime(`${formatDate(item.appointments_date)} ${item.appointments_end}`),
          color: item.color,
          publicId: item.id,
          resourceId: item.user_id,
        })),
      )
      setEvents(filterData)
      setUsersResources([
        {
          id: e.value,
          title: e.label,
        },
      ])

      setUsersData({
        value: e.value,
        label: e.label,
      })

      // setDoctorData(e)
    } else if (true) {
      let user = await getData('user')
      setUsersResources(
        user.data.map((item) => ({
          id: item.id,
          title: item.first_name + ' ' + item.last_name,
        })),
      )

      setUsersData({
        value: -1,
        label: 'All',
      })

      let res = await getData('appointments')
      var filterData = []
      filterData.push(
        ...res.data.map((item) => ({
          title: item.title,
          start: convertDatetime(
            `${formatDate(item.appointments_date)} ${item.appointments_start}`,
          ),
          end: convertDatetime(`${formatDate(item.appointments_date)} ${item.appointments_end}`),
          color: item.color,
          publicId: item.id,
          resourceId: item.user_id,
        })),
      )
      setEvents(filterData)
    }
  }

  const handleEventClicked = async (id) => {
    const param = `id=${id.publicId}`
    let res = await selectDataByParam('appointments', param)
    setDataForEdit(res.data[0])
    setVisibleModale(true)
    setFlagState(2)
  }

  return (
    <React.Fragment>
      <CalendarForm
        setReRenderData={setReRenderData}
        reRenderData={reRenderData}
        visible={visibleModale}
        setVisible={setVisibleModale}
        flagState={flagState}
        setFlagState={setFlagState}
        dataForEdit={dataForEdit}
        infoData={selectedInfo}
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
              <h2>Calendar </h2>
            </CCol>
            <CCol sm={1}></CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={3} className="p-0">
              <div style={{ zIndex: 10, position: 'relative' }}>
                <ReactSelect
                  value={usersData}
                  onChange={(e) => {
                    handleChangeUsers(e)
                  }}
                  options={usersSelect}
                  placeholder="Select a user"
                />
              </div>
            </CCol>
          </CRow>

          <CRow>
            {true && (
              <FullCalendar
                header={{
                  left: 'prev,next',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,resourceTimeGridDay',
                }}
                defaultView="timeGridWeek"
                dayHeaderFormat={{
                  weekday: 'long', // Display the full name of the weekday (e.g., Wednesday)
                  month: 'long', // Display the full name of the month (e.g., February)
                  day: 'numeric', // Display the day of the month (e.g., 14)
                  year: 'numeric', // Display the year (e.g., 2024)
                }}
                titleFormat={{
                  month: 'long', // Display the full name of the month (e.g., February)
                  year: 'numeric', // Display the year (e.g., 2024)
                  day: 'numeric', // Display the day of the month (e.g., 14)
                  weekday: 'long', // Display the full name of the weekday (e.g., Wednesday)
                  separator: ', ', // Separate components with a comma and space
                }}
                resources={usersResources}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
                events={events}
                allDaySlot={false}
                slotDuration="00:15"
                slotLabelInterval="00:15"
                selectable={true}
                select={handleSelected}
                minTime="08:00:00"
                maxTime="22:00:00"
                slotLabelFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  omitZeroMinute: false,
                  meridiem: false,
                }}
                eventRender={function (info) {
                  info.el.addEventListener('click', function () {
                    handleEventClicked(info.event._def.extendedProps)
                  })
                }}
              />
            )}
          </CRow>
        </>
      )}
    </React.Fragment>
  )
}

export default Calendar
