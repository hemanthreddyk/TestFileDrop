const Client = require('ssh2-sftp-client')
const fsPromises = require('fs').promises
const retryConfig = {
  retries: 5, //  Number of times to retry connecting
  retry_factor: 2, // Time factor used to calculate time between retries
  retry_minTimeout: 500 //  Minimum timeout between retries in milliseconds
}
const { host, port, username, password } = require('./constants')
const debug = (msg) => {
  fsPromises.appendFile('./sftp-debug.log', `${msg}\n`, 'utf-8')
}

async function getConnection () {
  console.log('connecting to sftp server...')
  const sftp = new Client()
  sftp.on('error', (error) => {
    console.log(`SFTP connection error: ${error}`)
  })
  try {
    await sftp.connect({ host, port, username, password, ...retryConfig, debug })
    return sftp
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function transferFile () {
  const fileContent = Buffer.from('Hello World')

  try {
    const sftp = await getConnection()
    for (let i = 1; i <= 1; i++) {
      const remoteFilePath = `/file${i}.txt`
      console.log(`Uploading the file-${i} to the remote SFTP server`)
      const response = await sftp.put(fileContent, remoteFilePath)
      console.log(`Finished uploading file-${i} ${response}`)
    }
    if (sftp) {
      await sftp.end()
      console.log('Connection ended successfully\n')
    }
  } catch (err) {
    console.log(err)
  }
}

transferFile()
