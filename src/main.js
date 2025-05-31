// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// DOM Elements
const navbar = document.getElementById('navbar');
const userDisplayName = document.getElementById('userDisplayName');
const authContainer = document.getElementById('authContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');
const googleLoginBtn = document.getElementById('googleLogin');
const facebookLoginBtn = document.getElementById('facebookLogin');
const twitterLoginBtn = document.getElementById('twitterLogin');
const switchAccountBtn = document.getElementById('switchAccount');
const logoutBtn = document.getElementById('logoutBtn');

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg shadow-lg text-white mb-4 transform transition-all duration-300 translate-y-full ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;

    const toastContainer = document.getElementById('toastContainer');
    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-full');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-full');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        userDisplayName.textContent = user.displayName || user.email;
        navbar.classList.remove('hidden');
        authContainer.classList.add('hidden');
        
        // Store auth state
        localStorage.setItem('isLoggedIn', 'true');
    } else {
        // User is signed out
        navbar.classList.add('hidden');
        authContainer.classList.remove('hidden');
        localStorage.removeItem('isLoggedIn');
    }
});

// Form toggle
showSignupBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Email/Password Login
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Successfully logged in!');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Email/Password Registration
registerFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        showToast('Account created successfully!');
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Social Login Handlers
googleLoginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        showToast('Successfully logged in with Google!');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

facebookLoginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, facebookProvider);
        showToast('Successfully logged in with Facebook!');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

twitterLoginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, twitterProvider);
        showToast('Successfully logged in with Twitter!');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showToast('Successfully logged out!');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Switch Account Handler
switchAccountBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        showToast('Please sign in with another account');
    } catch (error) {
        showToast(error.message, 'error');
    }
});