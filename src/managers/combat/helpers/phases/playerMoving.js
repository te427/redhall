import noOp from 'managers/combat/helpers/phases/noOp'

export default {
  ...noOp,
  start() {
    console.log('moving player')
  },
  end() {
    console.log('done moving player')
  }
}