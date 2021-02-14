
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery } from '@apollo/client'


const ALL_AUTHORS = gql`
    query{
        allAuthors{
                name
                born
                bookCount
        }
    }
`



const App = () => {
    const result = useQuery(ALL_AUTHORS)
    //console.log('result is in app component',result.data)


    const [page, setPage] = useState('authors')



    if ( result.loading ) {
  return <div>loading...</div>
}








  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        list={result.data.allAuthors}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App