import authApi from '../../middleware/firebase/auth';
import database from "../../middleware/firebase/database";
import db from "../../middleware/firebase/database/api";


export default {
    setLead: async ({state, commit}, lead) => {
        let entity = `users/${lead.uid}/data/leads/${lead.phoneNumber}/`
        await db.set(entity, lead)
    },

    setGuest: async ({state, commit}, options) => {
        let entity = `guests/${options.uid}/${options.eid}/${options.guestPhone}`
        await db.set(entity, options.guestsDetails)
    },


    firebaseLogout: async ({commit}) => {
        await authApi.signOut()
        localStorage.setItem('user', null)
        commit('setUser', null);
    },

    sendCodeToVerifyAction: async ({commit, state}, options) => {
        return await authApi.sendCodeToVerify(options)
    },


}
