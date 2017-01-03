'use strict'

// Imagine that it's a separate microservice :)

const Tortoise = require('tortoise')
const _ = require('lodash')

const tortoise = new Tortoise(process.env.RABBITMQ_URI || 'amqp://localhost')
const QUEUE_USER_CREATE = 'user-created'
const QUEUE_USER_EDIT = 'user-edited'

// My Denormalized DB
const denormalizedDB = {}

// Create user
tortoise
  .queue(QUEUE_USER_CREATE)
  .prefetch(1)
  .json()
  .subscribe((user, ack) => {
    // Store only name, denormalizer is not interested in other values
    denormalizedDB[user.id] = { name: user.name }
    ack()
  })

// Edit user
tortoise
  .queue(QUEUE_USER_EDIT)
  .prefetch(1)
  .json()
  .subscribe((user, ack) => {
    // Store only name, denormalizer is not interested in other values
    if (user.name) {
      denormalizedDB[user.id] = _.merge(denormalizedDB[user.id], { name: user.name })
    }
    ack()
  })

function getUserById (userId) {
  return denormalizedDB[userId]
}

module.exports = {
  getUserById
}
