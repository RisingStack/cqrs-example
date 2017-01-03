'use strict'

// Imagine that it's a separate microservice :)

const Tortoise = require('tortoise')
const _ = require('lodash')

const tortoise = new Tortoise(process.env.RABBITMQ_URI || 'amqp://localhost')
const QUEUE_USER_CREATE = 'user-created'
const QUEUE_USER_EDIT = 'user-edited'

// My user DB
const userDB = {}

function createUser (user) {
  // Create user in service's DB
  userDB[user.id] = user

  // Emit event about create
  return tortoise
    .queue(QUEUE_USER_CREATE)
    .publish({
      id: user.id,
      name: userDB[user.id].name,
      state: userDB[user.id].state
    })
}

function updateUser (user) {
  // Update user in service's DB
  userDB[user.id] = _.merge(userDB[user.id], user)

  // Emit event about update
  return tortoise
    .queue(QUEUE_USER_EDIT)
    .publish({
      id: user.id,
      name: userDB[user.id].name,
      state: userDB[user.id].state
    })
}

function getUserById (userId) {
  return userDB[userId]
}

module.exports = {
  createUser,
  updateUser,
  getUserById
}
