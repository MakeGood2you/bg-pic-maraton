import firebaseInstance from '../';

async function getLimit(options) {
    return await firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/events/${options.eventIdentity}/imgLimit`).once('value').then((res) => {
        console.log(res.val())
        return res.val()
    })
}

async function getLimitFromGuest(options) {
    return await firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/events/${options.eventIdentity}/guests/${options.phoneNumber}/limit`).once('value').then((res) => {
        console.log(res.val())
        return res.val()
    })
}
async function setCopyNumber(options){
    await firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/leads/${options.phone}/name`).set(`${options.leadName}`)
}
async function checkAuth(options) {
    const result = await firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/events/${options.eventIdentity}/guests/`).once('value').then((res)=>{
        const phones= res.val()
        for (var phone in phones){
            if (phone===options.phone){
                return true
            }
        }
    })
    return result
}

async function setLimit(options) {
    await firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/events/${options.eventIdentity}/guests/${options.phoneNumber}/limit`).set(options.counterImg)
}

function setDetails(options) {
    debugger
    return firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/events/${options.eventIdentity}/guests/${options.guestPhone}`).once(`value`)
        .then(res => {
            let x = null;
            const details = res.val()
            for (var id in details) {
                const detail = details[id];
                if (detail.phone === options.guestsDetails.phone) {
                    x = detail.phone;
                    return x;
                }
            }
            if (x === null) {
                debugger
                return firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/events/${options.eventIdentity}/guests/${options.guestPhone}`).set(options.guestsDetails)
            }
        })

}
async function getIsOpen(options) {
    const isOpen = firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/events/${options.eventIdentity}/isOpen`).once('value')
    return isOpen
}

function getAdminDetails(options) {
    return firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/events/${options.eventIdentity}`).once(`value`)
        .then((res) => {
            debugger
            return res.val()
        })
}
function getBInfo(options) {
    return firebaseInstance.firebase.database().ref(`users/${options.userIdentity}/data/businessInfo/`).once(`value`)
        .then((res) => {
            return res.val()
        })
}


export default {
    setDetails,
    getLimitFromGuest,
    getLimit,
    getAdminDetails,
    getBInfo,
    setLimit,
    setCopyNumber,
    checkAuth,
    getIsOpen
}
