// Enhanced Authentication Module
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
    updateProfile,
    sendEmailVerification
} from 'firebase/auth';

// Firebase configuration
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

// Configure providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

const twitterProvider = new TwitterAuthProvider();

// Enhanced Toast notification system
class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'toastContainer';
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
    }

    show(message, type = 'success', duration = 4000) {
        const toast = document.createElement('div');
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        toast.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0 flex items-center space-x-2 min-w-[300px]`;
        
        toast.innerHTML = `
            <span class="text-lg font-bold">${icons[type]}</span>
            <span class="flex-1">${message}</span>
            <button class="ml-2 text-white hover:text-gray-200 font-bold text-lg" onclick="this.parentElement.remove()">×</button>
        `;

        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });

        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    }

    remove(toast) {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (this.container.contains(toast)) {
                this.container.removeChild(toast);
            }
        }, 300);
    }
}

const toast = new ToastManager();

// Enhanced form validation
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) throw new Error('Email is required');
        if (!emailRegex.test(email)) throw new Error('Please enter a valid email address');
        return true;
    }

    static validatePassword(password) {
        if (!password) throw new Error('Password is required');
        if (password.length < 6) throw new Error('Password must be at least 6 characters long');
        return true;
    }

    static validateName(name, fieldName) {
        if (!name || name.trim().length < 2) {
            throw new Error(`${fieldName} must be at least 2 characters long`);
        }
        return true;
    }

    static checkPasswordMatch(password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    }
}

// Password strength checker
class PasswordStrengthChecker {
    static check(password) {
        let strength = 0;
        let feedback = [];

        if (password.length >= 8) {
            strength += 25;
        } else {
            feedback.push('At least 8 characters');
        }

        if (/[a-z]/.test(password)) {
            strength += 25;
        } else {
            feedback.push('Lowercase letter');
        }

        if (/[A-Z]/.test(password)) {
            strength += 25;
        } else {
            feedback.push('Uppercase letter');
        }

        if (/[0-9]/.test(password)) {
            strength += 25;
        } else {
            feedback.push('Number');
        }

        return { strength, feedback };
    }

    static updateUI(password, strengthElement, hintElement) {
        const { strength, feedback } = this.check(password);
        
        if (strengthElement) {
            strengthElement.style.width = `${strength}%`;
            
            // Color coding
            if (strength < 50) {
                strengthElement.className = 'h-1 rounded-full bg-red-500 transition-all duration-300';
            } else if (strength < 75) {
                strengthElement.className = 'h-1 rounded-full bg-yellow-500 transition-all duration-300';
            } else {
                strengthElement.className = 'h-1 rounded-full bg-green-500 transition-all duration-300';
            }
        }

        if (hintElement) {
            if (feedback.length > 0) {
                hintElement.textContent = `Missing: ${feedback.join(', ')}`;
                hintElement.className = 'text-xs text-red-500 mt-1';
            } else {
                hintElement.textContent = 'Strong password!';
                hintElement.className = 'text-xs text-green-500 mt-1';
            }
        }
    }
}

// Enhanced Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.initializeAuthStateListener();
        this.setupEventListeners();
    }

    initializeAuthStateListener() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.handleAuthStateChange(user);
        });
    }

    handleAuthStateChange(user) {
        if (user) {
            // User is signed in
            localStorage.setItem('loggedInUser', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            }));

            // Redirect to main page if on auth page
            if (window.location.pathname.includes('auth.html')) {
                window.location.href = '/';
            }
        } else {
            // User is signed out
            localStorage.removeItem('loggedInUser');
            
            // Redirect to auth page if not already there
            if (!window.location.pathname.includes('auth.html')) {
                window.location.href = '/auth.html';
            }
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Register form
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Social login buttons
        this.setupSocialLoginButtons();

        // Form toggle buttons
        this.setupFormToggle();

        // Password visibility toggles
        this.setupPasswordToggles();

        // Password strength checker
        this.setupPasswordStrengthChecker();

        // Logout buttons
        this.setupLogoutButtons();
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password');

        try {
            FormValidator.validateEmail(email);
            FormValidator.validatePassword(password);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.show(`Welcome back, ${userCredential.user.displayName || email.split('@')[0]}!`);
        } catch (error) {
            toast.show(this.getErrorMessage(error), 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const firstName = formData.get('firstName').trim();
        const lastName = formData.get('lastName').trim();

        try {
            FormValidator.validateEmail(email);
            FormValidator.validatePassword(password);
            FormValidator.validateName(firstName, 'First name');
            FormValidator.validateName(lastName, 'Last name');
            FormValidator.checkPasswordMatch(password, confirmPassword);

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update profile with full name
            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`
            });

            // Send email verification
            await sendEmailVerification(userCredential.user);

            toast.show('Account created successfully! Please check your email for verification.');
            
            // Switch to login form
            this.switchToLogin();
        } catch (error) {
            toast.show(this.getErrorMessage(error), 'error');
        }
    }

    setupSocialLoginButtons() {
        const googleBtn = document.getElementById('googleLogin');
        const facebookBtn = document.getElementById('facebookLogin');
        const twitterBtn = document.getElementById('twitterLogin');

        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleSocialLogin(googleProvider, 'Google'));
        }
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => this.handleSocialLogin(facebookProvider, 'Facebook'));
        }
        if (twitterBtn) {
            twitterBtn.addEventListener('click', () => this.handleSocialLogin(twitterProvider, 'Twitter'));
        }
    }

    async handleSocialLogin(provider, providerName) {
        try {
            const result = await signInWithPopup(auth, provider);
            toast.show(`Successfully logged in with ${providerName}!`);
            return result;
        } catch (error) {
            if (error.code === 'auth/popup-blocked') {
                toast.show('Please allow popups for this website', 'error');
            } else if (error.code === 'auth/popup-closed-by-user') {
                toast.show('Login cancelled', 'warning');
            } else {
                toast.show(this.getErrorMessage(error), 'error');
            }
        }
    }

    setupFormToggle() {
        const showSignupBtn = document.getElementById('showSignup');
        const showLoginBtn = document.getElementById('showLogin');

        if (showSignupBtn) {
            showSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToRegister();
            });
        }

        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToLogin();
            });
        }
    }

    switchToRegister() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('animate__fadeOut');
            setTimeout(() => {
                loginForm.classList.add('hidden');
                loginForm.classList.remove('animate__fadeOut');
                registerForm.classList.remove('hidden');
                registerForm.classList.add('animate__fadeIn');
            }, 300);
        }
    }

    switchToLogin() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            registerForm.classList.add('animate__fadeOut');
            setTimeout(() => {
                registerForm.classList.add('hidden');
                registerForm.classList.remove('animate__fadeOut');
                loginForm.classList.remove('hidden');
                loginForm.classList.add('animate__fadeIn');
            }, 300);
        }
    }

    setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        });
    }

    setupPasswordStrengthChecker() {
        const passwordInput = document.querySelector('input[name="password"]');
        const strengthElement = document.getElementById('passwordStrength');
        const hintElement = document.getElementById('passwordHint');

        if (passwordInput && strengthElement && hintElement) {
            passwordInput.addEventListener('input', (e) => {
                PasswordStrengthChecker.updateUI(e.target.value, strengthElement, hintElement);
            });
        }
    }

    setupLogoutButtons() {
        const logoutBtns = document.querySelectorAll('[id*="logout"], [id*="Logout"]');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', this.handleLogout.bind(this));
        });
    }

    async handleLogout() {
        try {
            await signOut(auth);
            toast.show('Successfully logged out!');
        } catch (error) {
            toast.show(this.getErrorMessage(error), 'error');
        }
    }

    async requestPasswordReset(email) {
        try {
            FormValidator.validateEmail(email);
            await sendPasswordResetEmail(auth, email);
            toast.show('Password reset email sent! Check your inbox.');
        } catch (error) {
            toast.show(this.getErrorMessage(error), 'error');
        }
    }

    getErrorMessage(error) {
        const errorMessages = {
            'auth/user-not-found': 'No account found with this email address',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'An account with this email already exists',
            'auth/weak-password': 'Password is too weak',
            'auth/invalid-email': 'Invalid email address',
            'auth/user-disabled': 'This account has been disabled',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later',
            'auth/network-request-failed': 'Network error. Please check your connection',
            'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site',
            'auth/cancelled-popup-request': 'Login cancelled',
            'auth/popup-closed-by-user': 'Login popup was closed'
        };

        return errorMessages[error.code] || error.message || 'An unexpected error occurred';
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Export for use in other modules
export { auth, toast, AuthManager };