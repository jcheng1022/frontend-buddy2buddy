class StorageService {


    clearData(keys) {
        for (const key of keys) {
            Storage.removeItem(key)
        }
    }

    setData(data) {
        for (const key in data) {
            Storage.setItem(key, data[key])

        }
    }

    getItem(name) {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem(name)
            if (item && typeof item === 'string') {
                try {
                    return JSON.parse(item)
                } catch (e) {
                    return item
                }
            }
            return item
        }


        return null;
    }

    setItem(name, value) {
        if (typeof window === 'undefined') {
            throw new Error('No local storage found')
        }
        localStorage.setItem(name, typeof value === 'string' ? value : JSON.stringify(value))
    }

    clear(excludedPrefixes) {
        if (typeof window === 'undefined') {
            throw new Error('No local storage found')
        }

        if ( excludedPrefixes && excludedPrefixes.length > 0) {
            for (const key in localStorage) {
                if (excludedPrefixes.every(o => !key.includes(o))) {
                    localStorage.removeItem(key)
                }
            }
        } else {
            localStorage.clear()
        }
    }

    removeItem(name) {
        if (typeof window === 'undefined') {
            throw new Error('No local storage found')
        }
        localStorage.removeItem(name)
    }
}

const Storage = new StorageService()

export default Storage
