
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/Login'
import {useApolloClient } from '@apollo/client'






const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(null)
    const client = useApolloClient()

 
useEffect(() => {setToken(localStorage.getItem('user-token', token))}, [])
  


const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }







  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button> : null}
        {token ? <button onClick={() => logout() }>Log out</button> : null}
        {!token ? <button onClick={() => setPage('login')}>Login</button> : null}
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

     {/*  <NewBook
        show={page === 'add'}
      /> */}

     <LoginForm 
       setPage={setPage}
       setToken={setToken}
       show={page === 'login'}
     />
    </div>
  )
}

export default App