import React, {useState} from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'



const ALL_AUTHORS = gql`
    query{
        allAuthors{
                name
                born
                bookCount
        }
    }
`

const EDIT_YEAR = gql`
  mutation editYear($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo)  {
      name
      born
    }
  }
`


const Authors =  (props) => {
 const result = useQuery(ALL_AUTHORS,{pollInterval: 100})
 const [ editAuthor ] = useMutation(EDIT_YEAR)
 const [selectedOption, setSelectedOption] = useState(null);


    console.log('result is in app component',result.data)

    if ( result.loading ) {return <div>loading...</div>}


  if (!props.show) {
    return null
  }
  const authors = result.data.allAuthors
  //console.log('props.list is ',props.list)

 



const setYear = () => {
 let a = document.getElementById('born').value

//console.log('selectedOption is ===>',selectedOption)
//console.log('a is =====>',a)

  editAuthor({ variables: { name: selectedOption, setBornTo: +a } })

}


const makeChange = (event) => {setSelectedOption(event.target.value)}


  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a => 
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

             <h2>Set Birth Year</h2> 
             name<select onChange={makeChange}>{authors.map(a => <option key={a.name} >{a.name}</option>)} </select><br/>                                                                                                                                          
             born<input type= "number" id='born' /><br/>
             <button onClick={setYear}>update author</button>
    </div>
  )
}

export default Authors




//name<input id='name'/><br/>