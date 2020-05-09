import * as child_process from 'child_process'
import * as util from 'util'

const exec = util.promisify(child_process.exec)

async function execGit(args: string, options: child_process.ExecOptions) {
  return await exec(`git ${args}`, options)
}

/**
 * Determines if `dir` is inside a repository where `origin` points to GitHub.
 *
 * Returns `true` if `dir` is a GitHub repository; `false` otherwise.
 */
export async function inGitHubRepo(dir: string) {
  try {
    const { stdout } = await execGit('remote get-url origin', { cwd: dir })

    return stdout.includes('github.com')
  } catch (e) {
    return false
  }
}

/**
 * Determines if `dir` is inside a git repository.
 *
 * Returns `true` if `dir` is inside a git repository; `false` otherwise.
 */
export async function inRepo(dir: string) {
  try {
    await execGit('rev-parse --is-inside-work-tree 2>/dev/null >/dev/null', { cwd: dir })

    return true
  } catch (e) {
    return false
  }
}
