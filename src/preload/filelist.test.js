import { getFilesFromDirectory } from './filelist'
import { vol } from 'memfs'
import * as path from 'path'

describe('getFilesFromDirectory', () => {
  const actualValue = async (files) => {
    vol.reset()
    files.forEach(async file => {
      const dir = path.dirname(file)
      if (dir != '.' && !vol.existsSync(dir)) {
        vol.mkdirpSync(dir)
      }
      vol.closeSync(vol.openSync('/' + file, 'w'))
    });
    return await getFilesFromDirectory(vol.promises, path, '/')
  }

  describe('root directory', () => {
    it('zero file', async () => {
      const actual = await actualValue([])
      expect(actual).toEqual([])
    })
    it('one file', async () => {
      const actual = await actualValue(['one.gpg'])
      expect(actual).toEqual([{ title: 'one', key: '0', path: 'one' }])
    })
    it('has a bad file', async () => {
      const actual = await actualValue(['one.gpg.tmp'])
      expect(actual).toEqual([])
    })
    it('many files', async () => {
      const actual = await actualValue(['one.gpg', 'two.gpg'])
      expect(actual).toEqual([
        { title: 'one', key: '0', path: 'one' },
        { title: 'two', key: '1', path: 'two' }
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
          path: 'foo',
          children: [
            { title: 'two', key: '0-0', path: 'foo/two' }
          ]
        },
        { title: 'one', key: '1', path: 'one' }
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
          path: 'foo',
          children: [
            { title: 'four', key: '0-0', path: 'foo/four' },
            { title: 'three', key: '0-1', path: 'foo/three' },
          ]
        },
        { title: 'one', key: '1', path: 'one' },
        { title: 'two', key: '2', path: 'two' },
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
          path: 'bar',
          children: [
            { title: 'five', key: '0-0', path: 'bar/five' },
            { title: 'six', key: '0-1', path: 'bar/six' }
          ]
        },
        {
          title: 'foo',
          key: '1',
          path: 'foo',
          children: [
            { title: 'four', key: '1-0', path: 'foo/four' },
            { title: 'three', key: '1-1', path: 'foo/three' },
          ]
        },
        { title: 'one', key: '2', path: 'one' },
        { title: 'two', key: '3', path: 'two' },
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
          path: 'foo',
          children: [
            {
              title: 'bar',
              key: '0-0',
              path: 'foo/bar',
              children: [
                { title: 'three', key: '0-0-0', path: 'foo/bar/three' },
              ]
            },
            { title: 'two', key: '0-1', path: 'foo/two' },
          ]
        },
        { title: 'one', key: '1', path: 'one' },
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
          path: 'foo',
          children: [
            {
              title: 'bar',
              key: '0-0',
              path: 'foo/bar',
              children: [
                { title: 'five', key: '0-0-0', path: 'foo/bar/five' },
                { title: 'six', key: '0-0-1', path: 'foo/bar/six' },
              ]
            },
            { title: 'four', key: '0-1', path: 'foo/four' },
            { title: 'three', key: '0-2', path: 'foo/three' },
          ]
        },
        { title: 'one', key: '1', path: 'one' },
        { title: 'two', key: '2', path: 'two' },
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
          path: 'foo',
          children: [
            {
              title: 'bar',
              key: '0-0',
              path: 'foo/bar',
              children: [
                { title: 'five', key: '0-0-0', path: 'foo/bar/five' },
                { title: 'six', key: '0-0-1', path: 'foo/bar/six' },
              ]
            },
            {
              title: 'baz',
              key: '0-1',
              path: 'foo/baz',
              children: [
                { title: 'eight', key: '0-1-0', path: 'foo/baz/eight' },
                { title: 'seven', key: '0-1-1', path: 'foo/baz/seven' },
              ]
            },
            { title: 'four', key: '0-2', path: 'foo/four' },
            { title: 'three', key: '0-3', path: 'foo/three' },
          ]
        },
        { title: 'one', key: '1', path: 'one' },
        {
          title: 'qux',
          key: '2',
          path: 'qux',
          children: [
            {
              title: 'bar',
              key: '2-0',
              path: 'qux/bar',
              children: [
                { title: 'ten', key: '2-0-0', path: 'qux/bar/ten' },
              ]
            },
            {
              title: 'baz',
              key: '2-1',
              path: 'qux/baz',
              children: [
                { title: 'eleven', key: '2-1-0', path: 'qux/baz/eleven' },
              ]
            },
            { title: 'nine', key: '2-2', path: 'qux/nine' },
          ]
        },
        { title: 'two', key: '3', path: 'two' },
      ])
    })
  })
})