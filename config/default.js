module.exports = {
  port: 5600,
  sessionDomain: null,
  publicUrl: 'http://localhost:5600',
  directoryUrl: 'http://localhost:5600/simple-directory',
  notifyUrl: 'http://localhost:5600/notify',
  mongo: {
    host: 'localhost',
    port: 27017,
    cmdTmpl: 'CMD',
    ignoreDBs: ['admin', 'config', 'local'],
    dumpParams: {}
  },
  backupDir: `data/backup`,
  dumpKeys: [
    'dir:portals-manager:/data/portals-manager',
    'dir:data-fair:/data/data-fair',
    'mongo'
  ],
  // OVH cloud archive backend for cold archiving
  cloudArchive: {
    tenant: null,
    user: null,
    password: null
  },
  splitSize: '200000000', // 200M
  secretKeys: {
    notifications: 'secret-notifications'
  },
  tmpdir: '/tmp/backup'
}
