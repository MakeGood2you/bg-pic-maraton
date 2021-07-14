import firebaseInstance from "../";

export default {

    storageRef: (entity) => {
        return firebaseInstance.firebase
            .storage()
            .ref(entity)
    },
    uploadFileToStorage: (options) => {
        options.ref.put(options.data)
    }
}