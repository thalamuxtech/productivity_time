import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyC2RJhVOs4RV0zyabbeelLQBirP4TtW63w",
  authDomain: "productivity-time.firebaseapp.com",
  projectId: "productivity-time",
  storageBucket: "productivity-time.firebasestorage.app",
  messagingSenderId: "956789650832",
  appId: "1:956789650832:web:56fb9994bd78ae66f9af15",
  measurementId: "G-7G5G7Q4HNT"
}

export const app = initializeApp(firebaseConfig)

// Only initialize analytics in browser environments that support it
export const analytics = isSupported().then(supported => {
  if (supported) {
    return getAnalytics(app)
  }
  return null
})
