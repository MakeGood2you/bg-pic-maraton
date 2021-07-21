"use strict"
import {QSpinnerGears} from 'quasar'

export const positive = (message = 'Submitted') => {
    return {
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message
    }
}
export const negative = (message = `This is a "negative" type notification.`) => {
    return {
        type: 'negative',
        message
    }
}

export const loading = (bol) => {
    return {
        spinner: QSpinnerGears,
        message: 'Working...',
        timeout: bol
    }
}

//