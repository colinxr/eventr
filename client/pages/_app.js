import App from 'next/app'
import { StoreProvider, useStoreActions } from 'easy-peasy'
import store from '../store'

function MyApp({Component, pageProps, user}) {
  console.log(user)

  return (
    <StoreProvider store={store}>
      <Component {...pageProps}/>
    </StoreProvider>
  )
}

MyApp.getInitialProps = async (context) => {
  const appProps = await App.getInitialProps(context)
  let user = null

  if (
    context.ctx.req &&
    context.ctx.req.session &&
    context.ctx.req.session.passport &&
    context.ctx.req.session.passport.user
  ) {
    user = context.ctx.req.session.passport.user
  }
  
  return { ...appProps, user }
}

export default MyApp