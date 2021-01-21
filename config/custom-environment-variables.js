module.exports = {
  publicUrl: 'PUBLIC_URL',
  sessionDomain: 'SESSION_DOMAIN',
  directoryUrl: 'DIRECTORY_URL',
  notifyUrl: 'NOTIFY_URL',
  mongo: {
    host: 'MONGO_HOST',
    readPreference: 'MONGO_READ_PREFERENCE',
    ignoreDBs: {
      __name: 'MONGO_IGNORE_DBS',
      __format: 'json'
    },
    dumpParams: {
      __name: 'MONGO_DUMP_PARAMS',
      __format: 'json'
    }
  },
  dumpKeys: {
    __name: 'DUMP_KEYS',
    __format: 'json'
  },
  cloudArchive: {
    tenant: 'CA_TENANT',
    user: 'CA_USER',
    password: 'CA_PASSWORD'
  },
  secretKeys: {
    notifications: 'SECRET_NOTIFICATIONS'
  },
  tmpdir: 'TMPDIR'
}
