import React, { useState, useEffect} from 'react'
import { gql, useQuery } from '@apollo/client'



const ALL_BOOKS = gql`
    query{
        allBooks{
                title
                published
                author
                genres
        }
    }


`






const GenreButtons = ({ books, updateFilter }) => {
    let genres = []

    books.forEach(book => {
        for (var i in book.genres) {
            if (!genres.includes(book.genres[i])) {
                genres.push(book.genres[i])
            }
        }
    })

    return (<div>
        <button onClick={() => updateFilter(null)}>all genres</button>
        {
            genres.map(genre => <button
                onClick={() => updateFilter(genre)}
                key={genre}>{genre}</button>)
        }
    </div>)
}







const Books = (props) => {
  const [filterBy, setFilterBy] = useState(null)
  const [books, setBooks] = useState([])
  const result = useQuery(ALL_BOOKS)
   // console.log(' ALL_BOOKS result is in app component',result)




 useEffect(() => {
        if (!result.data?.allBooks) return
        switch (filterBy) {
            case null:
                setBooks(result.data.allBooks)
                break
            default:
                setBooks(applyFilter(filterBy))
        }

    }, [result.data?.allBooks, filterBy])



const applyFilter = (filter) => {
        return result.data.allBooks.filter(book => {
            return book.genres.includes(filter)
        })
    }

    const updateFilter = (genre) => {
        setFilterBy(genre)
    }












  if (!props.show) {
    return null
  }

  const abooks = result.data.allBooks
console.log('result.data.allBooks is ===>', result.data.allBooks)
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
          {abooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      <GenreButtons books={abooks} updateFilter={updateFilter} />

    </div>
  )
}

export default Books