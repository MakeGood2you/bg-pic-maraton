import 'firebase/storage';
import db from '../../middleware/firebase/database/api'
import storage from '../../middleware/firebase/storage/'
import {formatNewDateToString} from './utils'

const eventPath = (uid, eid) => `users/${uid}/data/events/${eid}`
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
        const storageRef = storage.storageRef(entity)
        let listResult = await storageRef.listAll()//// check the length of all files
        let length = listResult.items.length
        ++length
        //create path
        const pathEntityBlob = entity + '/' + length
        // uploader image blob
        await storage.storageRef(pathEntityBlob).put(options.file)
        const urlBlob = await storage.storageRef(pathEntityBlob).getDownloadURL()
        console.log(urlBlob)
        // set limit of image each user
        const dbFileName = length < 10 ? `0${length}` : `${length}`
        entity = `users/${options.uid}/data/events/${options.eid}/photos/${dbFileName}`

        await db.set(entity, {
            photoURL: urlBlob,
            isDownload: false,
            isChosen: false,
            uploadTime: `${new Date().getTime()}`
        })

        entity = `users/${options.uid}/data/events/${options.eid}/picCounter`
        await db.set(entity, length)
        entity = `guests/${options.uid}/${options.eid}/${options.phoneNumber}/limit`
        commit('reduceGuestLimit')
        await db.set(entity, state.guestLimit)
    },

    isEventExist: async ({commit, state, dispatch}, options) => {
        const entity = `users/${options.uid}/data/events/${options.eid}`// event entity
        const isEntity= await db.get(entity)
        return isEntity
    },

    getAdminDetails: async ({commit, state, dispatch}, options) => {
        const entity = `users/${options.uid}/data/events/${options.eid}`// event entity
        const eventDetails = await db.get(entity) // get event details
        console.log(eventDetails)
        commit('setEventDetails', eventDetails)
    },

    getBusinessInfo: async ({commit, state, dispatch}, options) => {
        const entity = `users/${options.uid}/data/businessInfo`// event entity
        const businessInfo = await db.get(entity) // get event details

        commit('setBusinessInfo', businessInfo)
    },
    isEventOpenPermissionOpen:async ({commit, state}, options) => {
        const entity = `users/${options.uid}/data/events/${options.eid}/isOpen`// event entity
        const isEntity= await db.get(entity)
        return isEntity
    },
    isEventOpenPermission: async ({commit, state}) => {
        const momentDate = await formatNewDateToString()
        const eventDate = state.eventDetails.date
        if (momentDate === eventDate) {
            const isOpen = state.eventDetails.isOpen
            console.log(isOpen)
            if (isOpen === null || undefined) {
                await commit('setBoolean', {stateName: 'daylight', bool: false}) //close event
                alert('הגישה למערכת חסומה')
            } else {
                if (isOpen === true) {
                   await commit('setBoolean', {stateName: 'daylight', bool: true}) // open event
                } else {
                    alert('הרשאה למערכת לא תקפה')
                }
            }
        } else {
            alert('הרשאה לשימוש תפתח ביום האירוע')
        }
    },

    getFrame: async ({commit, dispatch}, options) => {
        let entity = `users/${options.uid}/data/events/${options.eid}/frame/photoURL`
        const frame = await db.get(entity)
        console.log('frame ', frame)

         commit("setFrame", frame)
        return frame
    },

    frameRatio: async ({commit, dispatch}, options) => {
        let entity = `users/${options.uid}/data/events/${options.eid}/frameRatio`
        const frameSize = await db.get(entity)

        commit("setFrameSize", frameSize)
        return frameSize
    },

    getLimitFromGuest: async ({commit, dispatch}, options) => {
        let entity = `guests/${options.uid}/${options.eid}/${options.phoneNumber}/limit`
        const guestLimit = await db.get(entity)
        commit("setGuestLimit", parseInt(guestLimit))
    },
    getLimitFromAdmin: async ({commit, dispatch}, options) => {
        const entity = `${eventPath(options.uid, options.eid)}/imgLimit`
        const adminLimit = await db.get(entity)
        commit("setGuestLimit", parseInt(adminLimit))
    },

}
