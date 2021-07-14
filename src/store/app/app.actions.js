import 'firebase/storage';
import db from '../../middleware/firebase/database/api'
import storage from '../../middleware/firebase/storage/'

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
        const uploader = await storageRef.child()
            .put(options.file[0], {uploaderName: options.firstName})
const downloader = uploader.get
        // set limit of image each user
        entity = `users/${options.uid}/data/events/${options.eid}/guests/${options.phoneNumber}/limit`
        await db.set(entity, options.limitedPicCounter)
    },


    addQuestionsAndAnswers: async ({commit, dispatch}, data) => {
        if (!data) return
        const entity = `/questionsAndAnswers`
        let key = (await db.create(entity, data)).key
        console.log(key)
        commit("addQuestionsAndAnswers", {data, key})
    },
    getQuestionsAndAnswers: async ({commit, dispatch}) => {
        const entity = `/questionsAndAnswers`
        const data = await db.get(entity)
        console.log(data)
        commit(`setQuestionsAndAnswers`, data)
    },
    removeQuestionAndAnswerAction: async ({commit, dispatch}, key) => {
        const entity = `/questionsAndAnswers/${key}`
        const res = await db.remove(entity)
        console.log(res)
        commit(`removeQuestionsAndAnswers`, key)
    },

}
