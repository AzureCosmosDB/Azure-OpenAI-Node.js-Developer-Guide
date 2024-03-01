const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// https://abbaslanbay.medium.com/node-js-rest-api-using-express-and-swagger-39744533dba4 

const options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'API',
      version: '0.1.0',
      description: '',
    }/*,
    servers: [
      {
        url: 'http://localhost:80',
      },
    ],*/
  },
  apis: ['*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
}
