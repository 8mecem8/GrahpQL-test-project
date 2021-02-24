import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//import { setContext } from 'apollo-link-context'

import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client'




const token = localStorage.getItem('user-token')


const client = new ApolloClient({
   cache: new InMemoryCache(), link : new HttpLink({uri:'http://127.0.0.1:4000/'})    /* http://localhost:4000 */,headers: {Authorization: token ? `bearer ${token}` : null}
})






ReactDOM.render(
<ApolloProvider client={client}>
<App />
</ApolloProvider>
, document.getElementById('root'))