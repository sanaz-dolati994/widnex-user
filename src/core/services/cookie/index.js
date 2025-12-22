import Cookies from "universal-cookie/es6";


const cookie = new Cookies()

const cookieService = {

    get(key, options) {
        return cookie.get(key, options)
    },

    set(key, value, options) {
      cookie.set(key, value, options)
    },

    delete(key) {
        return cookie.remove(key)
    }
}

export default cookieService
