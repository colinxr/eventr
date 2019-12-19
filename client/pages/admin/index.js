import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-fetch'
import { useStoreActions, useStoreState } from 'easy-peasy'
import Layout from '../../components/Layout'

const Admin = (props) => {
  const user = useStoreState(state => state.user.user)

  return (
    <Layout
      content={
        <h2>Admin</h2>
      }
    />
  )
}

Admin.getInitialProps = async ({ query }) => {
  const resp = await fetch('http://localhost:3001/api/events')
  const events = await resp.json()

  return { events }
}

export default Admin