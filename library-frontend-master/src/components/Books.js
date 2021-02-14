import React from 'react'
import { gql, useQuery } from '@apollo/client'


const ALL_BOOKS = gql`
    query{
        allBooks{
                title
                published
                author
        }
    }


`

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
    console.log(' ALL_BOOKS result is in app component',result)



  if (!props.show) {
    return null
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books