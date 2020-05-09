import * as Git from './git'

async function run() {
  if (await Git.inRepo(__dirname)) {
    console.log('In a git repo')
  } else {
    console.log('Not in a git repo')
  }
}

run()
