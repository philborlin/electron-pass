import { toTree } from './filelist'

describe('toTree', () => {
  describe('root directory', () => {
    it('zero file', () => {
      const files = []
      expect(toTree(files)).toEqual([])
    })
    it('one file', () => {
      const files = ['/homedir/.password-store/one.gpg']
      expect(toTree(files)).toEqual([{ title: 'one', key: '0' }])
    })
    it('one non-string', () => {
      const files = [{toString: () => '/homedir/.password-store/one.gpg'}]
      expect(toTree(files)).toEqual([{ title: 'one', key: '0' }])
    })
    it('many files', () => {
      const files = [
        '/homedir/.password-store/one.gpg',
        '/homedir/.password-store/two.gpg'
      ]
      expect(toTree(files)).toEqual([
        { title: 'one', key: '0' },
        { title: 'two', key: '1' }
      ])
    })
  })

  describe('root + one level deep', () => {
    it('one file on root and one file on first level', () => {
      const files = [
        '/homedir/.password-store/one.gpg',
        ['/homedir/.password-store/foo/two.gpg']
      ]
      expect(toTree(files)).toEqual([
        { title: 'one', key: '0' },
        {
          title: 'foo',
          key: '1',
          children: [
            { title: 'two', key: '1-0' }
          ]
        }
      ])
    })
    it('two files on root and two files on first level', () => {
      const files = [
        '/homedir/.password-store/one.gpg',
        '/homedir/.password-store/two.gpg',
        [
          '/homedir/.password-store/foo/three.gpg',
          '/homedir/.password-store/foo/four.gpg',
        ]
      ]
      expect(toTree(files)).toEqual([
        { title: 'one', key: '0' },
        { title: 'two', key: '1' },
        {
          title: 'foo',
          key: '2',
          children: [
            { title: 'three', key: '2-0' },
            { title: 'four', key: '2-1' }
          ]
        }
      ])
    })
    it('two files on root and two files on two subdirectories', () => {
      const files = [
        '/homedir/.password-store/one.gpg',
        '/homedir/.password-store/two.gpg',
        [
          '/homedir/.password-store/foo/three.gpg',
          '/homedir/.password-store/foo/four.gpg',
        ],
        [
          '/homedir/.password-store/bar/five.gpg',
          '/homedir/.password-store/bar/six.gpg',
        ]
      ]
      expect(toTree(files)).toEqual([
        { title: 'one', key: '0' },
        { title: 'two', key: '1' },
        {
          title: 'foo',
          key: '2',
          children: [
            { title: 'three', key: '2-0' },
            { title: 'four', key: '2-1' }
          ]
        },
        {
          title: 'bar',
          key: '3',
          children: [
            { title: 'five', key: '3-0' },
            { title: 'six', key: '3-1' }
          ]
        }
      ])
    })
  })
  describe('root + two level deep', () => {
    it('one file on each level', () => {
      const files = [
        '/homedir/.password-store/one.gpg',
        [
          '/homedir/.password-store/foo/two.gpg',
          [
            '/homedir/.password-store/foo/bar/three.gpg'
          ]
        ]
      ]
      expect(toTree(files)).toEqual([
        { title: 'one', key: '0' },
        {
          title: 'foo',
          key: '1',
          children: [
            { title: 'two', key: '1-0' },
            {
              title: 'bar',
              key: '1-1',
              children: [
                { title: 'three', key: '1-1-0' },
              ]
            }
          ]
        }
      ])
    })
    it('two files on each level', () => {
      const files = [
        '/homedir/.password-store/one.gpg',
        '/homedir/.password-store/two.gpg',
        [
          '/homedir/.password-store/foo/three.gpg',
          '/homedir/.password-store/foo/four.gpg',
          [
            '/homedir/.password-store/foo/bar/five.gpg',
            '/homedir/.password-store/foo/bar/six.gpg'
          ]
        ]
      ]
      expect(toTree(files)).toEqual([
        { title: 'one', key: '0' },
        { title: 'two', key: '1' },
        {
          title: 'foo',
          key: '2',
          children: [
            { title: 'three', key: '2-0' },
            { title: 'four', key: '2-1' },
            {
              title: 'bar',
              key: '2-2',
              children: [
                { title: 'five', key: '2-2-0' },
                { title: 'six', key: '2-2-1' },
              ]
            }
          ]
        }
      ])
    })
    it('two subdirectories on each level', () => {
      const files = [
        '/homedir/.password-store/one.gpg',
        '/homedir/.password-store/two.gpg',
        [
          '/homedir/.password-store/foo/three.gpg',
          '/homedir/.password-store/foo/four.gpg',
          [
            '/homedir/.password-store/foo/bar/five.gpg',
            '/homedir/.password-store/foo/bar/six.gpg'
          ],
          [
            '/homedir/.password-store/foo/baz/seven.gpg',
            '/homedir/.password-store/foo/baz/eight.gpg'
          ]
        ],
        [
          '/homedir/.password-store/qux/nine.gpg',
          [
            '/homedir/.password-store/qux/bar/ten.gpg',
          ],
          [
            '/homedir/.password-store/qux/baz/eleven.gpg',
          ]
        ]
      ]
      expect(toTree(files)).toEqual([
        { title: 'one', key: '0' },
        { title: 'two', key: '1' },
        {
          title: 'foo',
          key: '2',
          children: [
            { title: 'three', key: '2-0' },
            { title: 'four', key: '2-1' },
            {
              title: 'bar',
              key: '2-2',
              children: [
                { title: 'five', key: '2-2-0' },
                { title: 'six', key: '2-2-1' },
              ]
            },
            {
              title: 'baz',
              key: '2-3',
              children: [
                { title: 'seven', key: '2-3-0' },
                { title: 'eight', key: '2-3-1' },
              ]
            }
          ]
        },
        {
          title: 'qux',
          key: '3',
          children: [
            { title: 'nine', key: '3-0' },
            {
              title: 'bar',
              key: '3-1',
              children: [
                { title: 'ten', key: '3-1-0' },
              ]
            },
            {
              title: 'baz',
              key: '3-2',
              children: [
                { title: 'eleven', key: '3-2-0' },
              ]
            }
          ]
        }
      ])
    })
  })
})