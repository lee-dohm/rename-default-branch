import * as Git from './git'
import * as GitHub from './github'

import yargs = require('yargs')

/**
 * Options used to configure the execution of the program.
 */
interface Options {
  [x: string]: unknown

  /** Branch name to replace */
  bad: string

  /** New branch name to use when replacing */
  branch: string

  /** Token to use to perform API accesses */
  token: string

  /** Remaining command-line arguments */
  _: string[]
}

/**
 * Parses the command-line arguments into the options used to execute the program.
 */
function parseArguments(): Options {
  return yargs.options({
    bad: { type: 'string', default: 'master', describe: 'Branch name to replace' },
    branch: { type: 'string', default: 'primary', describe: 'New branch name' },
    token: {
      type: 'string',
      demandOption: true,
      describe: 'Personal access token to use for authorization',
    },
  }).argv
}

/**
 * Runs the program.
 */
async function run() {
  const options = parseArguments()
  const [owner, name] = options._[0].split('/')
  GitHub.setToken(options.token)

  const defaultBranch = await GitHub.getDefaultBranch(owner, name)

  if (defaultBranch.name === options.bad) {
    const ref = await GitHub.createBranch(
      options.branch,
      defaultBranch.repository.id,
      defaultBranch.target.oid
    )

    const response = await GitHub.updateDefaultBranch(owner, name, options.branch)
    console.log(JSON.stringify(response, null, 2))
  }
}

run()
