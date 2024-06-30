const dbName = 'seaSalonDB';
const userStoreName = 'users';
const reviewStoreName = 'reviews';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, 1);

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject('Error opening database');
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(userStoreName)) {
                const userStore = db.createObjectStore(userStoreName, { keyPath: 'userId', autoIncrement: true });
                userStore.createIndex('email', 'email', { unique: true });
            }

            if (!db.objectStoreNames.contains(reviewStoreName)) {
                db.createObjectStore(reviewStoreName, { keyPath: 'reviewId', autoIncrement: true });
            }
        };
    });
}

export function addUser(user) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction(userStoreName, 'readwrite');
            const store = transaction.objectStore(userStoreName);

            const request = store.add(user);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        } catch (error) {
            reject(error);
        }
    });
}

export function findUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction(userStoreName, 'readonly');
            const store = transaction.objectStore(userStoreName);
            const index = store.index('email');

            const request = index.get(email);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        } catch (error) {
            reject(error);
        }
    });
}

export function addReview(review) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction(reviewStoreName, 'readwrite');
            const store = transaction.objectStore(reviewStoreName);

            const request = store.add(review);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        } catch (error) {
            reject(error);
        }
    });
}

export function getAllReviews() {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction(reviewStoreName, 'readonly');
            const store = transaction.objectStore(reviewStoreName);

            const reviews = [];
            store.openCursor().onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    reviews.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(reviews);
                }
            };
        } catch (error) {
            reject(error);
        }
    });
}

export { openDatabase };
