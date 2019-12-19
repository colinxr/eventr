import React from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'

const Event = () => {
  return (
    <Layout
      content={
        <h2>Event</h2>
      }
     />
  )
}

Event.getInitialProps = ({query}) => {
  console.log(query)
  return {}
}

export default Event