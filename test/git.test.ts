import * as path from 'path'

import * as Git from '../lib/git'

describe('Git', () => {
  describe('inRepo', () => {
    it('returns true when in a git repo', async () => {
      expect(await Git.inRepo(__dirname)).toBe(true)
    })

    it('returns false when not in a git repo', async () => {
      const dir = path.resolve(__dirname, '..', '..')

      expect(await Git.inRepo(dir)).toBe(false)
    })
  })

  describe('inGitHubRepo', () => {
    it('returns true when origin points to a GitHub repository', async () => {
      expect(await Git.inGitHubRepo(__dirname)).toBe(true)
    })

    it('returns false when not in a git repo', async () => {
      const dir = path.resolve(__dirname, '..', '..')

      expect(await Git.inGitHubRepo(dir)).toBe(false)
    })

    it('returns false when in a git repo with no origin', async () => {
      const dir = path.resolve(__dirname, 'fixtures/repo-no-origin')

      expect(await Git.inGitHubRepo(dir)).toBe(false)
    })

    it('returns false when in a git repo where origin does not point to GitHub', async () => {
      const dir = path.resolve(__dirname, 'fixtures/repo-non-github-origin')

      expect(await Git.inGitHubRepo(dir)).toBe(false)
    })
  })
})
