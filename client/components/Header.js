import Router from 'next/router';
import { useStoreActions, useStoreState } from 'easy-peasy'

const Header = props => {
  const user = useStoreState(state => state.user.user)
  const setUser = useStoreActions(actions => actions.user.setUser)

  const handleLogout = async () => {
    await fetch('http://localhost:3001/api/auth/logout', { 
      method: 'post', 
      credentials: 'include'
    })
    setUser(null)
    Router.push('/login')
  }
  return (
    <header>
      <h2>{props.title}</h2>
      {
        user && (
          <button onClick={() => handleLogout() }>Logout</button>
        )
      }
      <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </header>
  )
}

export default Header