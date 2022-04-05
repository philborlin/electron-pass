import { getFilesFromDirectory } from './filelist'
import { vol } from 'memfs'
import * as path from 'path'

describe('getFilesFromDirectory', () => {
  const actualValue = async (files) => {
    vol.reset()
    files.forEach(file => {
      const dir = path.dirname(file)
      if (dir != '.' && !vol.existsSync(dir)) {
        vol.mkdirpSync(dir)
      }
      vol.closeSync(vol.openSync('/' + file, 'w'))
    });
    return await getFilesFromDirectory(vol, path, '/')
  }

  describe('root directory', () => {
    it('zero file', async () => {
      const actual = await actualValue([])
      expect(actual).toEqual([])
    })
    it('one file', async () => {
      const actual = await actualValue(['one.gpg'])
      expect(actual).toEqual([{ title: 'one', key: '0' }])
    })
    it('has a bad file', async () => {
      const actual = await actualValue(['one.gpg.tmp'])
      expect(actual).toEqual([])
    })
    it('many files', async () => {
      const actual = await actualValue(['one.gpg', 'two.gpg'])
      expect(actual).toEqual([
        { title: 'one', key: '0' },
        { title: 'two', key: '1' }
      ])
    })
  })

  describe('root + one level deep', () => {
    it('one file on root and one file on first level', async () => {
      const files = [
        'one.gpg',
        '/foo/two.gpg'
      ]
      const actual = await actualValue(files)
      expect(actual).toEqual([
        {
          title: 'foo',
          key: '0',
          children: [
            { title: 'two', key: '0-0' }
          ]
        },
        { title: 'one', key: '1' }
      ])
    })
    it('two files on root and two files on first level', async () => {
      const files = [
        'one.gpg',
        'two.gpg',
        '/foo/three.gpg',
        '/foo/four.gpg',
      ]
      const actual = await actualValue(files)
      expect(actual).toEqual([
        {
          title: 'foo',
          key: '0',
          children: [
            { title: 'four', key: '0-0' },
            { title: 'three', key: '0-1' },
          ]
        },
        { title: 'one', key: '1' },
        { title: 'two', key: '2' },
      ])
    })
    it('two files on root and two files on two subdirectories', async () => {
      const files = [
        'one.gpg',
        'two.gpg',
        '/foo/three.gpg',
        '/foo/four.gpg',
        '/bar/five.gpg',
        '/bar/six.gpg',
      ]
      const actual = await actualValue(files)
      expect(actual).toEqual([
        {
          title: 'bar',
          key: '0',
          children: [
            { title: 'five', key: '0-0' },
            { title: 'six', key: '0-1' }
          ]
        },
        {
          title: 'foo',
          key: '1',
          children: [
            { title: 'four', key: '1-0' },
            { title: 'three', key: '1-1' },
          ]
        },
        { title: 'one', key: '2' },
        { title: 'two', key: '3' },
      ])
    })
  })

  describe('root + two level deep', () => {
    it('one file on each level', async () => {
      const files = [
        'one.gpg',
        '/foo/two.gpg',
        '/foo/bar/three.gpg'
      ]
      const actual = await actualValue(files)
      expect(actual).toEqual([
        {
          title: 'foo',
          key: '0',
          children: [
            {
              title: 'bar',
              key: '0-0',
              children: [
                { title: 'three', key: '0-0-0' },
              ]
            },
            { title: 'two', key: '0-1' },
          ]
        },
        { title: 'one', key: '1' },
      ])
    })
    it('two files on each level', async () => {
      const files = [
        'one.gpg',
        'two.gpg',
        '/foo/three.gpg',
        '/foo/four.gpg',
        '/foo/bar/five.gpg',
        '/foo/bar/six.gpg'
      ]
      const actual = await actualValue(files)
      expect(actual).toEqual([
        {
          title: 'foo',
          key: '0',
          children: [
            {
              title: 'bar',
              key: '0-0',
              children: [
                { title: 'five', key: '0-0-0' },
                { title: 'six', key: '0-0-1' },
              ]
            },
            { title: 'four', key: '0-1' },
            { title: 'three', key: '0-2' },
          ]
        },
        { title: 'one', key: '1' },
        { title: 'two', key: '2' },
      ])
    })
    it('two subdirectories on each level', async () => {
      const files = [
        'one.gpg',
        'two.gpg',
        '/foo/three.gpg',
        '/foo/four.gpg',
        '/foo/bar/five.gpg',
        '/foo/bar/six.gpg',
        '/foo/baz/seven.gpg',
        '/foo/baz/eight.gpg',
        '/qux/nine.gpg',
        '/qux/bar/ten.gpg',
        '/qux/baz/eleven.gpg',
      ]
      const actual = await actualValue(files)
      expect(actual).toEqual([
        {
          title: 'foo',
          key: '0',
          children: [
            {
              title: 'bar',
              key: '0-0',
              children: [
                { title: 'five', key: '0-0-0' },
                { title: 'six', key: '0-0-1' },
              ]
            },
            {
              title: 'baz',
              key: '0-1',
              children: [
                { title: 'eight', key: '0-1-0' },
                { title: 'seven', key: '0-1-1' },
              ]
            },
            { title: 'four', key: '0-2' },
            { title: 'three', key: '0-3' },
          ]
        },
        { title: 'one', key: '1' },
        {
          title: 'qux',
          key: '2',
          children: [
            {
              title: 'bar',
              key: '2-0',
              children: [
                { title: 'ten', key: '2-0-0' },
              ]
            },
            {
              title: 'baz',
              key: '2-1',
              children: [
                { title: 'eleven', key: '2-1-0' },
              ]
            },
            { title: 'nine', key: '2-2' },
          ]
        },
        { title: 'two', key: '3' },
      ])
    })
  })
})