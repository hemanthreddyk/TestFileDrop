const SftpClient = require('./ssh2-client')
const stream = require('stream')
const { Readable } = stream

const { config } = require('./constants')

async function transferFile () {
  const { username, password, host, port } = config

  const fileContent = Buffer.from('Hello World')

  const SftpClients = new SftpClient({ username, password, host, port }, {})
  try {
    for (let i = 1; i <= 10; i++) {
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
