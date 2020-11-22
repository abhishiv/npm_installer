import express from 'express'
import {v4} from 'uuid'
import process from 'process'
import bodyParser from 'body-parser'

const app = express();

app.use(bodyParser.json())

export async function getLockfilePostInstall(taskId, manifest, lockFile) {
  return {}
}
app.post("/install", async (req, res) => {
  const body = req.body;
  const {manifest, lockFile} = body;
  const taskId = v4();
  const updatedLockfile = await getLockfilePostInstall(taskId, manifest, lockFile)
  res.status(200).send({
    manifest: manifest,
    lockFile: updatedLockfile,
    taskId
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('listening on port', port)
})