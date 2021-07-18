import actions from './auth.actions'
import getters from './auth.getters'
import mutations from './auth.mutations'
import state from './auth.state'

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}