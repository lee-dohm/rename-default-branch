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
})
