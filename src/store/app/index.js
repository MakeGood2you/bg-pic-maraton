import actions from './app.actions'
import getters from './app.getters'
import mutations from './app.mutations'
import state from './app.state'

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}