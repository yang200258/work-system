const ss = window.sessionStorage;
export default {
    getItem(key) {
        try {
            return JSON.parse(ss.getItem(key))
        } catch (err) {
            return null
        }
    },
    setItem(key, val) {
        try {
            ss.setItem(key, JSON.stringify(val))
        } catch {
            return null
        }
    },
    clear() {
        ss.clear()
    },
    keys() {
        return ss.keys()
    },
    removeItem(key) {
        ss.removeItem(key)
    }
}