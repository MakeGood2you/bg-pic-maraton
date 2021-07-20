import firebaseInstance from '../'

export default {
    sendCodeToVerify
}

async function sendCodeToVerify(options) {

    const phoneNumber = '+972' + options.phone;
    // const appVerifier = window.recaptchaVerifier;
    debugger
    firebaseInstance.firebase.auth().signInWithPhoneNumber(phoneNumber, options.appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            debugger
            return confirmationResult
        })
}