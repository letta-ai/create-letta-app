import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('start', () => {
  it('runs start cmd', async () => {
    const {stdout} = await runCommand('start')
    expect(stdout).to.contain('hello world')
  })

  it('runs start --name oclif', async () => {
    const {stdout} = await runCommand('start --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
