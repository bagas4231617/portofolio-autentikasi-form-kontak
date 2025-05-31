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
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
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

// Enhanced Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg shadow-lg text-white mb-4 transform transition-all duration-300 translate-y-full ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    
    // Add icon based on type
    const icon = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${icon}</span>
            <span>${message}</span>
        </div>
    `;

    const toastContainer = document.getElementById('toastContainer');
    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-full');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-full');
        toast.addEventListener('transitionend', () => {
            toastContainer.removeChild(toast);
        });
    }, 3000);
}

// Enhanced Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        userDisplayName.textContent = user.displayName || user.email.split('@')[0];
        navbar.classList.remove('hidden');
        authContainer.classList.add('hidden');
        
        // Store auth state and user info
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
    } else {
        // User is signed out
        navbar.classList.add('hidden');
        authContainer.classList.remove('hidden');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
    }
});

// Enhanced Form validation
function validateForm(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
    }
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
}

// Enhanced Email/Password Login
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
        validateForm(email, password);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showToast(`Welcome back, ${userCredential.user.email.split('@')[0]}!`);
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Enhanced Email/Password Registration
registerFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();

    try {
        validateForm(email, password);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with full name
        await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`
        });

        showToast('Account created successfully!');
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Enhanced Social Login Handlers
async function handleSocialLogin(provider, providerName) {
    try {
        const result = await signInWithPopup(auth, provider);
        showToast(`Successfully logged in with ${providerName}!`);
        return result;
    } catch (error) {
        if (error.code === 'auth/popup-blocked') {
            showToast('Please allow popups for this website', 'error');
        } else {
            showToast(error.message, 'error');
        }
        throw error;
    }
}

googleLoginBtn.addEventListener('click', () => handleSocialLogin(googleProvider, 'Google'));
facebookLoginBtn.addEventListener('click', () => handleSocialLogin(facebookProvider, 'Facebook'));
twitterLoginBtn.addEventListener('click', () => handleSocialLogin(twitterProvider, 'Twitter'));

// Enhanced Logout Handler
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showToast('Successfully logged out!');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Enhanced Switch Account Handler
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

// Password Reset Function
window.requestPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset email sent!');
    } catch (error) {
        showToast(error.message, 'error');
    }
};