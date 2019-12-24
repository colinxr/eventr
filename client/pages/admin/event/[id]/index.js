import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import fetch from 'isomorphic-fetch'
import Layout from '../../../../components/Layout'

const Event = (props) => {
  const [showUnknown, setShowUnknown] = useState(false)
  const [list, setList] = useState(props.data.guests)

  const getUnknownGuests = async () => {
    await fetch('http://localhost:3001/api/events/')
  }

  return (
    <Layout
      content={
        <>
          <h2>{props.data.event.title}</h2>
          <p>{props.data.guests.length} Guests</p>

          <button onClick={(e) => {
              e.preventDefault()
              setShowUnknown(!showUnknown)
            }}>View 
              {showUnknown ? 'Approved' : 'Unknown'}
            </button>

          <br />
          <br />
          <table>
            {
              list.map((entry, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.email}</td>

                    {
                      showUnknown && (
                        <>
                          <td><button>Approve</button></td>
                          <td><button>Denied</button></td>
                        </>
                      )
                    }
                  </tr>
                )
              })
            }
          </table>
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

  return { id: query.id, data }
}

export default Event
