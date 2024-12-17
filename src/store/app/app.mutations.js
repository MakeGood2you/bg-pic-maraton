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
    setFrameSize: (state, frameSize) => {
        state.frameSize = frameSize
    },
}
