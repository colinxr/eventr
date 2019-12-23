import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-fetch'
import Layout from '../../../../components/Layout'

const Event = (props) => (
  <Layout
    content={
      <h2>{props.event.title}</h2>
    }
  />
)

Event.getInitialProps = async ({req, query}) => {
  const { id } = query 
  const resp = await fetch(`http://localhost:3001/api/events/${id}`, {
    credentials: 'include',
    headers: req ? { cookie: req.headers.cookie } : undefined
  })

  const event = await resp.json()

  return { id: query.id, event }
}

export default Event
