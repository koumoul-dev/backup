module.exports = {
  mongo: {
    cmdTmpl: `docker run --privileged=true --network=host --rm -v /tmp:/tmp -v ${process.cwd()}:/workdir/:Z -w /workdir/ mongo:4.0 bash -c "CMD"`
  },
  splitSize: '100'
}
