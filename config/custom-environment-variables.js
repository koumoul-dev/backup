module.exports = {
  publicUrl: 'PUBLIC_URL',
  sessionDomain: 'SESSION_DOMAIN',
  directoryUrl: 'DIRECTORY_URL',
  notifyUrl: 'NOTIFY_URL',
  mongo: {
    host: 'MONGO_HOST',
    ignoreDBs: {
      __name: 'MONGO_IGNORE_DBS',
      __format: 'json'
    }
  },
  cloudArchive: {
    tenant: 'CA_TENANT',
    user: 'CA_USER',
    password: 'CA_PASSWORD'
  },
  secretKeys: {
    notifications: 'SECRET_NOTIFICATIONS'
  }
}
