import { filterFiles, getAllKeys } from './filelist'

describe('filelist', () => {
  const fileOne = { title: 'one', key: '0', path: 'one' }
  const fileTwo = { title: 'two', key: '1', path: 'two' }
  const folderFoo = {
    title: 'foo', key: '0', path: 'foo', children: [
      { title: 'one', key: '0-0', path: 'foo/one' },
      { title: 'two', key: '0-1', path: 'foo/two' },
    ]
  }

  describe('getAllKeys', () => {
    describe('root directory', () => {
      it('no files', async () => {
        expect(getAllKeys([])).toEqual([])
      })
      it('one file', async () => {
        expect(getAllKeys([fileOne])).toEqual(['0'])
      })
      it('many files', async () => {
        expect(getAllKeys([fileOne, fileTwo])).toEqual(['0', '1'])
      })
    })

    describe('root + one level deep', () => {
      expect(getAllKeys([folderFoo, fileTwo])).toEqual(['0', '0-0', '0-1', '1'])
    })
  })

  describe('filterFiles', () => {
    describe('root directory', () => {
      it('no files filtered', async () => {
        const files = [fileOne]
        expect(filterFiles('', files)).toEqual([fileOne])
      })
      it('one file filtered', async () => {
        const files = [fileOne, fileTwo]
        expect(filterFiles('one', files)).toEqual([fileOne])
      })
      it('many files filtered', async () => {
        const files = [fileOne, fileTwo]
        expect(filterFiles('three', files)).toEqual([])
      })
      it('case insensitive', async () => {
        const files = [fileOne, fileTwo]
        expect(filterFiles('ONE', files)).toEqual([fileOne])
      })
    })

    describe('root + one level deep', () => {
      it('one file on root and one file on first level', async () => {
        const folderFooFiltered = {
          title: 'foo', key: '0', path: 'foo', children: [
            { title: 'two', key: '0-1', path: 'foo/two' },
          ]
        }

        const files = [folderFoo, fileTwo]
        expect(filterFiles('two', files)).toEqual([folderFooFiltered, fileTwo])
      })
    })
  })
})