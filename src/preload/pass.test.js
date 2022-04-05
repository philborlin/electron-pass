import { pass } from './pass'

describe('pass', () => {
  it('path does not exist', async () => {
    const exec = jest.fn()
    pass(exec, '')
  })
})