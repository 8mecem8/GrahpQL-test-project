const { ApolloServer, gql,UserInputError, AuthenticationError } = require('apollo-server');
const { TypeInfo } = require('graphql');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose')
const config = require('./config')
const jwt = require('jsonwebtoken')

const Bookss = require('./Models/Books')
const Authorss = require('./Models/Authors')
const Userss = require('./Models/User')



const JWT_SECRET = '190018001200'



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
    name: 'c', // birthyear not known
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

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

  
type Authors {
    name: String
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
    published: String
    genres: [String!]
  ): Books

editAuthor(
  name: String 
  setBornTo: Int
  ): Authors


createUser(
    username: String!
    favoriteGenre: String
  ): User
  
  
login(
    username: String!
    password: String!
  ): Token


}


type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Books]
    allAuthors: [Authors]
    me: User
}
`

const resolvers = {
  Query: {
    me:(_,arg,context) => {return context.currentUser},
    bookCount: () =>  Bookss.collection.countDocuments(),         //Bookss.find({}).then(re => { return re.length }) , //books.length,
    authorCount: () => Authorss.find({}).then(re => {return re.length}) ,//authors.length,
    allBooks:()=> Bookss.find({}).then(re => { return re }) ,       //books,
    /* allBooks: (_, arg) => {
              if(arg.constructor === Object){ return () => books}
                  console.log('arg is ====', arg.constructor === Object)


              a= books.filter(at => at.author === arg.author)
              b= books.filter(at => at.genres.includes(arg.genre))
      if(arg.author){return a}
      if(arg.genre){return b}
      if(arg.genre || arg.author) {return a.filter(at => at.genres.includes(arg.genre))}

    
    }, */
    allAuthors: async () =>{
         const ag = await Authorss.find({})

         //console.log('ag is ===>', ag)

            return ag.map(at => ({
        name: at.name,
        born: at.born,
        bookCount:  Bookss.find({author: at._id}).countDocuments() }) )
            
      /* authors.map(at => ({
        name: at.name,
        born: at.born,
        bookCount: books.filter(book => book.author === at.name).length
      }))
      
      at.bookCount = Bookss.find({_id: ag._id}).length || 0
      
      
      
       */

  }
  },
   Mutation: {
      addBook: async (_, arg, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            let finAut = await Authorss.findOne({name : arg.author})

            if(!finAut){ const addNewAut = new Authorss({name : arg.author})

            try {  await addNewAut.save()}
            catch(err) {throw new UserInputError(err.message, {
                        invalidArgs: arg,
                    })}
                  }


                     const NBook = new Bookss({...arg})


                    NBook.author = finAut._id
                      
                    try { NBook.save()} 
              catch(err) {throw new UserInputError(err.message, {invalidArgs: arg,})}
              

              return NBook 
           
             
            /* const nBook = {...arg, id: uuidv4()}
            if(authors.includes(arg.author)){ const nAuthor = {name:arg.author,id: uuidv4()}
          
             authors.concat(nAuthor)
          
          } */
//console.log(arg)
//console.log('books list is ',books)
//console.log('authors list is',authors)

           /*  books =[...books,nBook]    //books.concat(nBook)
            return nBook */
 },


        editAuthor: async (_, arg) => {
               /* if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            } */


               let neAuthor = await Authorss.findOne({name: arg.name})

                neAuthor.born =  arg.setBornTo
                await neAuthor.save()

                return neAuthor
              




            /* const neAuthor = authors.find(at => at.name === arg.name)
             if (!neAuthor) {return null}

            console.log(arg.name,arg.setBornTo)
             const updatedAuthor = {...neAuthor, born: arg.setBornTo}
             authors= authors.map(at=> at.name === arg.name ? updatedAuthor : at)

            return updatedAuthor */

            },


        createUser: (root, arg) => {
    const user = new Userss({ username: arg.username })
            console.log(arg)
    return user.save()
      .catch(err => {
        throw new UserInputError(err.message, {
          invalidArgs: arg,
        })
      })
  },


        login: async (root, arg) => {
    const user = await Userss.findOne({ username: arg.username })
            console.log(arg)
    if ( !user || arg.password !== '12345' ) {
      throw new UserInputError("wrong credentials")
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, JWT_SECRET) }
  },






























   }}





 MainServerConnect = async () => {
await mongoose.connect(config.DB_C, { useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true })
.then( () => console.log('Connected to MongoDB'))
.catch(err => console.log('error connecting to MongoDB:', err.message))



const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  context: async ({ req }) => 
  
  {
  
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser } }


  } 

})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
}



MainServerConnect()
