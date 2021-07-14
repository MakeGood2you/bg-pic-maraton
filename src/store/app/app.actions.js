import 'firebase/storage';
import db from '../../middleware/firebase/database/api'
import storage from '../../middleware/firebase/storage/'
import {formatNewDateToString} from './utils'

export default {
    // this is the options object///
    ///////////////////////////////
    //   firstName,
    //   file,
    //   uid:userid
    //   eid: event id,
    //   fileName: file[0].name,
    //   phoneNumber: this.phoneNumber,
    //   limitedPicCounter: this.limitedPic from user
    uploadImageToStorage: async ({commit, state, dispatch}, options) => {
        let entity = `users/${options.uid}/events/${options.eid}`
        const storageRef = (entity) => storage.storageRef(entity)

        let listResult = await storageRef(entity).listAll()//// check the object
        let length = listResult.items.length

        await storageRef(entity).child(`${length}`) // uploader image blob
            .put(options.file, {uploaderName: options.firstName})
        const entityBlob = entity + '/' + length

        const urlBlob = await storageRef(entityBlob).getDownloadURL()
        console.log(urlBlob)
        // const downloader = uploader
        // set limit of image each user
        // entity = `users/${options.uid}/data/events/${options.eid}/guests/${options.phoneNumber}/limit`
        // await db.set(entity, options.limitedPicCounter)
        entity = `users/${options.uid}/data/events/${options.eid}/guests/${options.phoneNumber}/limit`
        await db.set(entity, options.limitedPicCounter)
    },

    getAdminDetails: async ({commit, state, dispatch}, options) => {
        const entity = `users/${options.uid}/data/events/${options.eid}`// event entity
        const eventDetails = await db.get(entity) // get event details
        commit('setEventDetails', eventDetails)
    },

    getBusinessInfo: async ({commit, state, dispatch}, options) => {
        const entity = `users/${options.uid}/data/businessInfo`// event entity
        const businessInfo = await db.get(entity) // get event details

        commit('setBusinessInfo', businessInfo)
    },

    isEventOpenPermission: async ({commit, state}) => {
        const momentDate = formatNewDateToString()
        const eventDate = state.eventDetails.date

        if (momentDate === eventDate) {
            const isOpen = state.eventDetails.isOpen
            console.log(isOpen)
            if (isOpen === null || undefined) {
                commit('setBoolean', {stateName: 'daylight', bool: false}) //close event
                alert('הגישה למערכת חסומה')
            } else {
                if (isOpen === true) {
                    commit('setBoolean', {stateName: 'daylight', bool: true}) // open event
                } else {
                    alert('הרשאה למערכת לא תקפה')
                }
            }
        } else {
            alert('הרשאה לשימוש תפתח ביום האירוע')
        }

    },
    getLimitFromGuest: async ({commit, dispatch}, options) => {
        const entity = `users/${options.uid}/data/events/${options.eid}/guests/${options.phoneNumber}/limit`
        const guestLimit = await db.get(entity)
        commit("setGuestLimit", guestLimit)
    },

}
