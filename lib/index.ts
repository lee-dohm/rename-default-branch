import * as Git from './git'
import * as GitHub from './github'

import yargs = require('yargs')

interface Arguments {
  [x: string]: unknown
  bad: string
  branch: string
  token: string
  _: string[]
}

function parseArguments(): Arguments {
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

async function run() {
  const argv = parseArguments()
  const [owner, name] = argv._[0].split('/')
  GitHub.setToken(argv.token)
  
  const defaultBranch = await GitHub.getDefaultBranch(owner, name)

  if (defaultBranch.name === argv.bad) {
    const ref = await GitHub.createBranch(
      argv.branch,
      defaultBranch.repository.id,
      defaultBranch.target.oid
    )

    const response = await GitHub.updateDefaultBranch(owner, name, argv.branch)
    console.log(JSON.stringify(response), null, 2)
  }
}

run()
