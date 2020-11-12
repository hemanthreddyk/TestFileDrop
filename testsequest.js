const SftpClient = require('./sequest-client')
const stream = require('stream')
const { Readable } = stream

const { username, password, host, port } = require('./constants')

async function transferFile () {
  const fileContent = Buffer.from('Hello World')

  try {
    for (let i = 1; i <= 100; i++) {
      const SftpClients = new SftpClient({ username, password, host, port }, {})
      const readableStream = new Readable()
      readableStream.push(fileContent)
      readableStream.push(null)
      const remoteFilePath = `/file${i}.txt`
      console.log('file-' + i + ' started')
      await SftpClients.upload(remoteFilePath, readableStream)
      console.log('file-' + i + ' dropped\n')
    }
  } catch (err) {
    console.log(err)
  }
}

transferFile()
