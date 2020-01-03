import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import fetch from 'isomorphic-fetch'
import Layout from '../../../../components/Layout'
import Table from '../../../../components/Table'

const Event = (props) => {
  const [showUnknown, setShowUnknown] = useState(false)
  const [approved, setApproved] = useState(props.approved)
  const [unknown, setUnknown] = useState(props.unknown)
  const [flash, setFlash] = useState('')

  const tableData = showUnknown ? unknown : approved

  const handleApprove = async (e, id) => {
    e.preventDefault()

    const resp = await fetch(`http://localhost:3001/api/guests/${id}/approve`, {
      method: 'PUT',
      credentials: 'include',
      headers: props.req ? { cookie: props.req.headers.cookie } : undefined
    })

    const data = await resp.json()
    console.log(data)
    if (data.status === 'success') {
      const guest = findGuestById(id) 
      const newUnknowns = removeGuestFromUnknowns(id)

      const newApproved = [...approved, guest]

      setUnknown(newUnknowns)
      setApproved(newApproved)

      setFlash(`${guest.name} has been approved`)
    }
  }

  const handleDeny = async (e, id) => {
    e.preventDefault()
    const resp = await fetch(`http://localhost:3001/api/guests/${id}/deny`, {
      method: 'PUT',
      credentials: 'include',
      headers: props.req ? { cookie: props.req.headers.cookie } : undefined
    })
    const data = await resp.json()
    console.log(data)

    if (data.status === 'success') {
      const guest = findGuestById(id)
      const newUnknowns = removeGuestFromUnknowns(id)
      setUnknown(newUnknowns)
      setFlash(`${guest.name} has been denied`)
    }
  }

  const findGuestById = (id) => unknown.find(guest => guest.id === id)

  const removeGuestFromUnknowns = (id) => unknown.filter(guest => guest.id !== id)
  

  return (
    <Layout
      content={
        <>
          {
            flash !== '' && (
              <div className="flash">{flash}</div>
            )
          }
          <header>
          <h2>{props.data.event.title} { showUnknown ? ' | Unknown RSVPS' : '' }</h2>
          <p>{tableData.length} Guests</p>

          <button onClick={(e) => {
              e.preventDefault()
              
              setFlash('')
              setShowUnknown(!showUnknown)
            }}>View  
              {showUnknown ? ' Approved' : ' Unknown'}
            </button>
          
          </header>

          <Table 
            list={ tableData } 
            showControls={ showUnknown ? true : false } 
            handleApprove={ handleApprove }
            handleDeny={ handleDeny }
          />
          <style jsx>{`
            header { margin-bottom: 3rem }

            .flash { 
              background-color: #eaeaea; 
              padding: 5px 15px; 
            }
          `}</style>
        </>
      }
    />
  )
}

Event.getInitialProps = async ({req, query}) => {
  const { id } = query 
  const resp = await fetch(`http://localhost:3001/api/events/${id}`, {
    credentials: 'include',
    headers: req ? { cookie: req.headers.cookie } : undefined
  })

  const data = await resp.json()
  const approved = []
  const unknown = []

  data.guests.forEach(guest => {
    if (guest.status === 'approved') approved.push(guest)
    if (guest.status === 'unknown') unknown.push(guest)
  })

  return { id: query.id, data, approved, unknown, }
}

export default Event
