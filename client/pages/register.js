import React, {useState, setState} from 'react'
import Head from 'next/head'
import { useStoreActions, useStoreState } from 'easy-peasy'
import Router from 'next/router';
import Layout from '../components/Layout'
import store from '../store'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== passwordConfirmation) {
      alert('Password must match')
      return
    }


    try {
      fetch('http://localhost:3001/api/auth/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password, passwordConfirmation})
      })
      .then(resp => resp.json())
      .then(resp => {
        if (resp.status === 'error') {
          alert(resp.message)
          return
        }

        Router.push('/admin')
      })
    } catch (error) {
      console.log(error)
      // alert(error.response.data.message)
    }
  }
  
  return (
    <Layout
      content={
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="container">
              <h1>Register</h1>
              <p>Please fill in this form to create an account.</p>
              <hr />

              <div className="formGroup">
                <label htmlFor="email"><b>Email</b></label>
                <input 
                  type="text" 
                  placeholder="Enter Email" 
                  name="email" 
                  value={email}
                  required 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="psw"><b>Password</b></label>
                <input 
                  type="password" 
                  placeholder="Enter Password" 
                  value={password}
                  name="psw" 
                  required 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="formGroup">
                <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
                <input 
                  type="password"
                  placeholder="Enter Password"
                  name="pswConf"
                  value={passwordConfirmation}
                  required
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                /> 
              </div>
              <hr />

              <button type="submit">Register</button>
            </div>

            <div className="container signin">
              <p>Already have an account? <a href="/login">Sign in</a>.</p>
            </div>
            <style jsx>{`
              form { 
                max-width: 300px; 
                margin: 0 auto; 
              }

              .formGroup + .formGroup {
                margin-top: 1rem;
              }

              label { margin-bottom: .5rem; }

              input { 
                display: block; 
                width: 100%; 
                border-radius: 4px;
                padding: 1rem;
                border: 1px solid #eaeaea;
                margin-top: .5rem;
              }

              button {
                display: block;
                color: white;
                background-color: #4a4a4a;
                width: 100%;
                border-radius: 4px;
                padding: 1rem;
                font-size: 1rem;
                font-weight: 300;
                letter-spacing: 1px;
              }
            `}</style>  
          </form>
      }
    />
  )
}

export default Register
