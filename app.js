const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const mongoose = require('mongoose')
const app = express()

app.use(bodyParser.json())

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
)
mongoose
  .connect(
    `
mongodb+srv://${process.env.MONGOUSER}:${
      process.env.MONGO_PASSWORD
    }@rest-api-test-qqfch.mongodb.net/${process.env.MONGO_DB}?retryWrites=true
`
  )
  .then(() => {
    app.listen(3000)
  })
  .catch(err => {
    console.log('error Conecting', err)
  })
