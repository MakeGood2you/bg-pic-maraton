import authApi from '../../middleware/firebase/auth';
import database from "../../middleware/firebase/database";


export default {
//genric login functions
    login: async ({state, commit, dispatch}, provider) => {
        //check login provider

        let firebaseAuthUser = await dispatch('checkProviderUser', provider)
        if (typeof firebaseAuthUser === 'string') {
            console.error('there is not chosen provider')
            return firebaseAuthUser
        }
        commit('setUser', firebaseAuthUser)
        commit('isUserExist',true)
        localStorage.setItem('user', JSON.stringify(firebaseAuthUser))

        // set the user in state and localstorage

        //chek if is accept terms
        const uid = firebaseAuthUser.uid
        const isAcceptTerms = await dispatch('checkTerm', uid)

        console.log('is Accept Terms ?', isAcceptTerms)
        if (isAcceptTerms) {
            await dispatch('businesses/isUserPayValidate', uid, {root: true})
            commit('setUser', firebaseAuthUser)
            commit('setPropertyTrueOrFalse', 'isAcceptTerms')
            localStorage.setItem('user', JSON.stringify(firebaseAuthUser))
        } else {
            commit('setPropertyTrueOrFalse', 'isFixed')
            // open pop up to confirm the terms
            // TODO : CHNACH THE VARIBLE IN COMPONNENT TO POINTER TO STATE
        }
    },

    register: async ({commit, state, dispatch}, user) => {
        const firebaseAuthUser = await authApi.registerWithPassAndEmail(user)
        if (!firebaseAuthUser) return console.error('not user')
        commit('setUser', firebaseAuthUser)
        await dispatch('setTermService', firebaseAuthUser.uid)
        localStorage.setItem('user', JSON.stringify(firebaseAuthUser))
//      TODO: chek if user alredy exist and let give err to the user
    },

    firebaseLogout: async ({commit}) => {
        await authApi.signOut()
        localStorage.setItem('user', null)
        commit('setUser', null);
    },

    checkProviderUser: async ({commit, state}, provider) => {
        let firebaseAuthUser
        if (provider) {
            if (provider.email && provider.password) {
                firebaseAuthUser = await authApi
                    .loginWithMailAndPass(provider)
                // TODO: Check if user is already exist
                return firebaseAuthUser

            } else if (provider === 'facebook' || provider === 'google') {
                firebaseAuthUser = await authApi.loginProvider(provider)
                return firebaseAuthUser
            } else return false
        }
    },

    checkTerm: async ({commit}, uid) => {
        const term = await database.checkTermService(uid)
        return term
    },

    setTermService: async ({state, commit}, uid) => {
        uid = state.user.uid ||
            JSON.parse(localStorage.getItem('user')) ||
            window.user.uid || uid
        commit('setPropertyTrueOrFalse', 'isFixed')


        await database.setTerm(uid)
    },
    updatePassword: async ({state, commit}, newPassword) => {
        const result = await authApi.updatePassword(newPassword)
        console.log(result)
        return result
    }

}
