import noOp from 'managers/combat/helpers/phases/noOp'

export default {
  ...noOp,
  start() {
    console.log('player attacking')
  },
  end() {
    console.log('player attack finished')
  }
}