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
        const storageRef = (entity) => storage.storageRef(entity)
        let entity = `users/${options.uid}/events/${options.eid}`

        let listResult = await storageRef(entity).listAll()//// check the length of all files
        let length = listResult.items.length
        ++length

        const pathEntityBlob = entity + '/' + length
        // uploader image blob
        await storageRef(pathEntityBlob).put(options.file)
        const urlBlob = await storageRef(pathEntityBlob).getDownloadURL()
        console.log(urlBlob)
        // set limit of image each user
        const dbFileName = length < 10 ? `0${length}` : `${length}`
        entity = `users/${options.uid}/data/events/${options.eid}/photos/${dbFileName}`
        await db.set(entity, {
            photoURL: urlBlob,
            isDownload: false,
            isChosen: false
        })

        entity = `users/${options.uid}/data/events/${options.eid}/picCounter`
        await db.set(entity, length)
        entity = `users/${options.uid}/data/events/${options.eid}/guests/${options.phoneNumber}/limit`
        debugger
        await db.set(entity, options.limitedPicCounter)
        commit('setGuestLimit', options.limitedPicCounter)
    },

    getAdminDetails: async ({commit, state, dispatch}, options) => {
        const entity = `users/${options.uid}/data/events/${options.eid}`// event entity
        const eventDetails = await db.get(entity) // get event details
        debugger
        commit('setEventDetails', eventDetails)
    },

    getBusinessInfo: async ({commit, state, dispatch}, options) => {
        const entity = `users/${options.uid}/data/businessInfo`// event entity
        const businessInfo = await db.get(entity) // get event details

        commit('setBusinessInfo', businessInfo)
    },

    isEventOpenPermission: async ({commit, state}) => {
        const momentDate = formatNewDateToString()
        debugger
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
