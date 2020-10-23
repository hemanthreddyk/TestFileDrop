const sequest = require('sequest')

class SftpClient {
  constructor (secrets) {
    this.setSecrets(secrets)
  }

  getSecrets () {
    return this.secrets
  }

  setSecrets (secrets) {
    this.secrets = secrets
  }

  getConnection () {
    const SECRETS = this.getSecrets()

    console.log('Connecting to sftp server...')
    return sequest.connect(`${SECRETS.username}@${SECRETS.host}:${SECRETS.port}`, {
      password: SECRETS.password
    })
  }

  upload (remotePath, fileStream) {
    console.log('Saving file...')

    return new Promise((resolve, reject) => {
      const connection = this.getConnection()

      // We are calling the connection function because we want to catch the
      // error on no connection gracefully. The fix was found here:
      // https://github.com/mscdex/ssh2/issues/464
      const seq = connection()

      seq.on('error', (error) => {
        reject(new Error('Failed to connect to SFTP server', error))
      })

      const writer = connection.put(remotePath)

      writer.on('error', err => {
        reject(new Error('Error in uploading file to SFTP server', err))
      })
      writer.on('close', () => {
        // Finished writing file to SFTP stream
        console.log('Finished uploading file!')
        resolve()
      })

      console.log('Waiting for upload to finish...')
      fileStream.pipe(writer)
    })
  }
}

module.exports = SftpClient
