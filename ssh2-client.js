const Client = require('ssh2-sftp-client')
const retryConfig = {
  retries: 5, //  Number of times to retry connecting
  retry_factor: 2, // Time factor used to calculate time between retries
  retry_minTimeout: 500 //  Minimum timeout between retries in milliseconds
}

class SftpClient {
  constructor (secrets, traceObj) {
    this.setSecrets(secrets)
    this.traceObj = traceObj
  }

  getSecrets () {
    return this.secrets
  }

  setSecrets (secrets) {
    this.secrets = secrets
  }

  async getConnection () {
    const SECRETS = this.getSecrets()
    console.log('connecting to sftp server...')
    const sftp = new Client()
    sftp.on('error', (error) => {
      // just to log more detail error
      console.log(`SFTP connection error: ${error}`)
    })
    try {
      await sftp.connect({
        ...SECRETS,
        ...retryConfig
      })
      return sftp
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async upload (remotePath, fileStream) {
    let sftpClient
    try {
      sftpClient = await this.getConnection()
      console.log('Uploading the file to the remote SFTP server')
      await sftpClient.put(fileStream, remotePath)
      console.log('Finished uploading the file')
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      if (sftpClient) {
        sftpClient.end()
      }
    }
  }
}

module.exports = SftpClient
