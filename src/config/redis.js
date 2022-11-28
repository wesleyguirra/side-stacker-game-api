const { Client } = require('redis-om')

const client = new Client()
client.open('redis://redis:6379')

module.exports = client;