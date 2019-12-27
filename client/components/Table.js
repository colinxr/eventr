const Table = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <td>id</td>
          <td>name</td>
          <td>email</td>
          <td>instagram</td>

          {
            props.showControls && (
              <>  
                <td>approve</td>
                <td>deny</td>
              </>
            )
          }
        </tr>
      </thead>
      <tbody>
        {
          props.list.map((entry, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.email}</td>
                <td>{entry.instagram}</td>

                {
                  props.showControls && (
                    <>
                      <td>
                        <button
                          onClick={(e) => props.handleApprove(e, entry.id)}>
                          Approve
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={(e) => props.handleDeny(e, entry.id)}>
                          Denied
                        </button>
                      </td>
                    </>
                  )
                }
              </tr>
            )
          })
        }
      </tbody>

      <style jsx>{`
        table { width: 100%; }
        
        thead {
          font-size: .75rem; 
          color: #666;
          border-bottom: 1px solid #999;
          padding: 5px 0;
        }

        td + td { margin-left: 25px; }
      `}</style>

    </table>
  )
}

export default Table