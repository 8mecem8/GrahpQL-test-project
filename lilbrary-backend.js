const { ApolloServer, gql } = require('apollo-server');
const { TypeInfo } = require('graphql');
const { v4: uuidv4 } = require('uuid');

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  
type Authors {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }


type Books {
    title: String
    published: Int
    author: String
    id: ID
    genres: [String]
  }

type Mutation {
  addBook(
    title: String
    author: String
    published: Int
    genres: [String!]
  ): Books

editAuthor(
  name: String 
  setBornTo: Int
  ): Authors

}


type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Books]
    allAuthors: [Authors]
}
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks:()=> books,
    /* allBooks: (_, arg) => {
              if(arg.constructor === Object){ return () => books}
                  console.log('arg is ====', arg.constructor === Object)


              a= books.filter(at => at.author === arg.author)
              b= books.filter(at => at.genres.includes(arg.genre))
      if(arg.author){return a}
      if(arg.genre){return b}
      if(arg.genre || arg.author) {return a.filter(at => at.genres.includes(arg.genre))}

    
    }, */
    allAuthors: () =>
      authors.map(at => ({
        name: at.name,
        born: at.born,
        bookCount: books.filter(book => book.author === at.name).length
      }))

  },

   Mutation: {
      addBook: (_, arg) => {
            const nBook = {...arg, id: uuidv4()}
            if(authors.includes(arg.author)){ const nAuthor = {name:arg.author,id: uuidv4()}
          
             authors.concat(nAuthor)
          
          }

console.log('books list is ',books)
console.log('authors list is',authors)

            books =[...books,nBook]    //books.concat(nBook)
            return nBook
 },


        editAuthor: (_, arg) => {
            const neAuthor = authors.find(at => at.name === arg.name)
             if (!neAuthor) {return null}


             const updatedAuthor = {...neAuthor, born: arg.setBornTo}
             authors= authors.map(at=> at.name === arg.name ? updatedAuthor : at)

            return updatedAuthor

        }
   }
  
}

const server = new ApolloServer({ typeDefs, resolvers, })

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})