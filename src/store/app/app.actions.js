import 'firebase/storage';
import db from '../../middleware/firebase/database/'

export default {
    
    async uploadImageToStorage() {
        const storageRef = firebase.storage().ref(`${this.eid}`)
        const firstName = this.firstName
        const originalName = file[0].name
        const newFilename = `${Date.now()}.${file[0].name}`
        const metadata = {
            customMetadata: {
                originalName,
                firstName
            }
        }
        if (this.limitedPic <= 0) {
            console.log('none')
        } else {

            await storageRef.child(newFilename).put(file[0], metadata)

            this.limitedPic--

            const userIdentity = this.$route.params.uid
            const eventIdentity = this.$route.params.eid
            const phoneNumber = this.phoneNumber
            const counterImg = this.limitedPic

            await firebaseDatabase.setLimit({userIdentity, eventIdentity, phoneNumber, counterImg})

        }
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
