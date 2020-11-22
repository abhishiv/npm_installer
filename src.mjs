import express from 'express'
import {v4} from 'uuid'
import process from 'process'
import bodyParser from 'body-parser'
import cors from 'cors';
import spawn from 'await-spawn'
import fs from 'fs';
import path from 'path'
import {promisify} from 'util'
const app = express();

app.use(bodyParser.json())
app.use(cors())

export async function getLockfilePostInstall(taskId, manifest, lockFile) {
  const dir = path.join(process.cwd(), "tasks", taskId)
  console.log('dir', dir)
  console.log(manifest, lockFile)
  await spawn('mkdir', [  dir])
  await promisify(fs.writeFile)(path.join(dir, 'package.json'), JSON.stringify(manifest))
  await promisify(fs.writeFile)(path.join(dir, 'package-lock.json'), JSON.stringify(lockFile))
  await spawn('npm', ['i', '--package-lock-only'], {cwd: dir})
  const updatedLockFileText = await promisify(fs.readFile)(path.join(dir, 'package-lock.json'), {encoding: 'utf8'})
  return JSON.parse(updatedLockFileText)
}
app.post("/_/npm/install", async (req, res) => {
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