import * as child_process from 'child_process'
import * as util from 'util'

const exec = util.promisify(child_process.exec)

async function execGit(args: string) {
  return await exec(`git ${args}`)
}

async function inGitRepo() {
  try {
    await execGit("rev-parse --is-inside-work-tree 2>/dev/null >/dev/null")

    return true
  } catch {
    return false
  }
}

async function run() {
  if (await inGitRepo()) {
    console.log("In a git repo")
  } else {
    console.log("Not in a git repo")
  }
}

run()
