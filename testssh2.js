const SftpClient = require('./ssh2-client')
const stream = require('stream')
const { Readable } = stream

const { username, password, host, port } = require('./constants')
const sleep = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

async function transferFile () {
  const fileContent = Buffer.from('Hello World')

  try {
    for (let i = 1; i <= 10; i++) {
      const SftpClients = new SftpClient({ username, password, host, port, debug: (msg) => console.log(`${msg}\n`) }, {})
      const remoteFilePath = `/file${i}.txt`
      console.log('file-' + i + ' started')
      const x = await SftpClients.upload(remoteFilePath, fileContent)
      console.log('file-' + i + ' dropped\n')
    }
  } catch (err) {
    console.log(err)
  }
}

transferFile()


// const readableStream = new Readable()
// readableStream.push(fileContent)
// readableStream.push(null)