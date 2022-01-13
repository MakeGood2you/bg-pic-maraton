export default {
    setBoolean: (state, option) => {
        state[option.stateName] = option.bool
    },
    setEventDetails: (state, eventDetails) => {
        state.eventDetails = eventDetails
    },
    setGuestLimit: (state, guestLimit) => {
        state.guestLimit = guestLimit
    },
    setAdminLimit: (state, adminLimit) => {
        state.adminLimit = adminLimit
    },
    setBusinessInfo: (state, businessInfo) => {
        state.businessInfo = businessInfo
    },
    reduceGuestLimit: (state) => {
        state.guestLimit = state.guestLimit - 1
    },
    setFrame: (state, frame) => {
        state.frame = frame
    },
    setFrameSize:(state, frameSize) => {
    state.frameSize = frameSize
},
    // setTrue: (state, name) => {
    //     state[name] = true
    // },
    // isOpenDialog: (state) => {
    //     state.isOpen = !state.isOpen
    // },
    //

    // addQuestionsAndAnswers: (state, options) => {
    //     state.questionsAndAnswers.data[options.key] = options.data
    //     state.questionsAndAnswers.data = {...state.questionsAndAnswers.data}
    // },
    //
    // setQuestionsAndAnswers: (state, data) => {
    //     state.questionsAndAnswers.data = data
    // },
    // removeQuestionsAndAnswers: (state, key) => {
    //     delete state.questionsAndAnswers.data[key]
    //     state.questionsAndAnswers.data = {...state.questionsAndAnswers.data}
    // },

}
