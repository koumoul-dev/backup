# backup

Backup management service.

For now these functionalities are supported:

  - backup mongodb databases
  - backup directories
  - split files to prevent copying large files
  - daily backup into a directory (NFS, etc.)
  - weekly backup in cold archiving tool (OVH cloud archive for now)
  - admin only web UI
  - notifications in case of failure

Dev env:

```
docker-compose up -f
npm run dev-server
npm run dev-client
```

Testing dump scripts:

```
node scripts/dump.js mongo
node scripts/dump.js dir:test:./test
node scripts/restore.js dir:test:./test
node scripts/restore.js mongo/data-fair-production
```
