'use strict'

// Let's test our "microservices", now just calling them as functions, in a real world it's happening via API calls etc.

const userService = require('./userService')
const denormalizerService = require('./denormalizerService')

// Test
const userId = 'aaa'
// eslint-disable-next-line
const log = console.log

log('Running...')

userService
  .createUser({ id: userId, name: 'John Doe', state: 'default' })
  .then(() => userService.updateUser({ id: userId, state: 'churn' }))
  .then(() => userService.updateUser({ id: userId, name: 'John Smith' }))
  .then(() => {
    // Client "query" denormalizer
    // Yepp, eventual consistency, wit until denormalizer goes sync
    setTimeout(() => {
      log('User in user service database', userService.getUserById(userId))
      log('User in Reporting Database', denormalizerService.getUserById(userId))

      process.exit()
    }, 1000)
  })
