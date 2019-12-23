import React from 'react'
import Head from 'next/head'
import Router from 'next/router';
import fetch from 'isomorphic-fetch'
import { useStoreActions, useStoreState } from 'easy-peasy'
import Layout from '../../components/Layout'
import Header from '../../components/Header'

const Admin = (props) => {
  return (
    <Layout
      content={
        <>
        <Header title="admin" />
          {/* {console.log( props )} */}

          { 
            props.error && 
              <h3>You need to be logged in to access this page</h3>
          }

          {
            props.events ? props.events.map(event => {
              return (
                <div className="event">
                  <h2>{event.title}</h2>
                  <p>{event.venue}</p>
                </div>
              )
            }) : ''
          }
        </>
      }
    />
  )
}

Admin.getInitialProps = async (ctx) => {
  const resp = await fetch('http://localhost:3001/api/events', {
    credentials: 'include',
    headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined
  })

  const data = await resp.json()

  if (data.status === 'error') { 
    return { error: 'not logged in'}
  }
  
  return { events: data }
}

export default Admin