import Head from 'next/head'

const Layout = props => {
  return (
    <>
      <Head>

      </Head>
      <main>
        {props.content}
      </main>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }

        * { box-sizing: border-box }
        
        main  {
          width: 95%;
          max-width: 970px;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}

export default Layout