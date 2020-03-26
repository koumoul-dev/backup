const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const moment = require('moment')
const { spawn } = require('child-process-promise')
const { MongoClient } = require('mongodb')
const tmp = require('tmp-promise')

const absoluteBackupDir = path.resolve(process.cwd(), config.backupDir)

if (config.cloudArchive.tenant) {
  fs.writeFileSync('/tmp/ca-password.txt', `${config.cloudArchive.tenant}.${config.cloudArchive.user}.${config.cloudArchive.password}`)
}

async function exec(cmd, opts = {}) {
  opts.stdio = 'inherit'
  console.log('Run: ', cmd, opts)
  return spawn('bash', ['-c', cmd], opts)
}

exports.dump = async (dumpKey, name) => {
  name = name || dateStr(new Date())

  await fs.ensureDir(`${config.backupDir}/${name}`)
  const archives = []
  if (dumpKey === 'mongo') {
    const client = await MongoClient.connect(`mongodb://${config.mongo.host}:${config.mongo.port}`, { useNewUrlParser: true })
    const dbs = await client.db('admin').admin().listDatabases()
    await client.close()
    for (const db of dbs.databases.map(db => db.name).filter(db => !config.mongo.ignoreDBs.includes(db))) {
      const tmpFile = await tmp.file()
      const tmpPath = tmpFile.path
      await exec(config.mongo.cmdTmpl.replace('CMD', `mongodump --host ${config.mongo.host} --port ${config.mongo.port} --db ${db} --gzip --archive=${tmpPath}`))
      archives.push({ tmpFile, tmpPath, name: `mongo-${db}.gz` })
    }
    await client.close()
  } else if (dumpKey.startsWith('dir:')) {
    const [archiveName, dirPath] = dumpKey.split(':').slice(1)
    const tmpFile = await tmp.dir({ unsafeCleanup: true })
    const tmpPath = `${tmpFile.path}/archive.zip`
    await exec(`zip ${tmpPath} -q -r -- *`, { cwd: dirPath })
    archives.push({ tmpFile, tmpPath, name: `${archiveName}.zip` })
  } else {
    throw new Error(`Unknown dump key "${dumpKey}"`)
  }

  for (const archive of archives) {
    await exec(`split -b ${config.splitSize} ${archive.tmpPath} ${archive.name}-`, { cwd: `${absoluteBackupDir}/${name}` })
    archive.tmpFile.cleanup()
  }
}

exports.archive = async (name) => {
  name = name || dateStr(new Date())
  const files = await fs.readdir(`${absoluteBackupDir}/${name}`)
  for (const file of files) {
    // await exec(`sshpass -f /tmp/ca-password.txt rsync -e "ssh -o StrictHostKeyChecking=no" -av ${absoluteBackupDir}/${name}/* pca@gateways.storage.sbg.cloud.ovh.net:backup/${name}/`)
    await exec(`sshpass -f /tmp/ca-password.txt scp -o StrictHostKeyChecking=no ${absoluteBackupDir}/${name}/${file} pca@gateways.storage.sbg.cloud.ovh.net:backup/${name}-${file}`)
  }
}

exports.restore = async (dumpKey, name) => {
  name = name || dateStr(new Date())
  if (dumpKey.startsWith('mongo/')) {
    // for mongo the db is passed as mongo/simple-directory-production
    const db = dumpKey.replace('mongo/', '')
    const tmpFile = await tmp.file()
    await exec(`cat mongo-${db}.gz-* > ${tmpFile.path}`, { cwd: `${absoluteBackupDir}/${name}` })
    await exec(config.mongo.cmdTmpl.replace('CMD', `mongorestore --drop --host ${config.mongo.host} --port ${config.mongo.port} --db ${db} --gzip --archive=${tmpFile.path}`))
    tmpFile.cleanup()
  } else if (dumpKey.startsWith('dir:')) {
    const [archiveName, dirPath] = dumpKey.split(':').slice(1)
    const tmpFile = await tmp.dir({ unsafeCleanup: true })
    await exec(`cat ${archiveName}.zip-* > ${tmpFile.path}/archive.zip`, { cwd: `${absoluteBackupDir}/${name}` })
    await fs.ensureDir(dirPath)
    await exec(`unzip -o ${tmpFile.path}/archive.zip -d ${dirPath}`)
    tmpFile.cleanup()
  } else {
    throw new Error(`Unknown dump key "${dumpKey}"`)
  }
}

function dateStr(d) {
  return d.toISOString().slice(0, 10)
}

// manage and remove deprecated daily/weekly/monthly dumps
exports.rotate = async () => {
  const now = moment()
  const last = dateStr(now)
  const dirs = await fs.readdir(config.backupDir)
  for (const dir of dirs) {
    if (dir === last) continue
    if (isNaN(new Date(dir).getTime())) continue

    const date = moment(dir)
    const age = now.diff(date, 'days')

    if (date.date() === 1) {
      // first day of month means a monthly backup, keep it for 1 year
      if (age > 365) {
        console.log('Remove old monthly dump', dir)
        await fs.remove(`${config.backupDir}/${dir}`)
      } else {
        console.log('Keep monthly dump', dir)
      }
    } else if (date.weekday() === 1) {
      // first day of week means a weekly backup, keep it 3 weeks
      if (age > 22) {
        console.log('Remove old weekly dump', dir)
        await fs.remove(`${config.backupDir}/${dir}`)
      } else {
        console.log('Keep weekly dump', dir)
      }
    } else {
      // others are daily backup, keep 4 days
      if (age > 4) {
        console.log('Remove old daily dump', dir)
        await fs.remove(`${config.backupDir}/${dir}`)
      } else {
        console.log('Keep daily dump', dir)
      }
    }
  }
}
