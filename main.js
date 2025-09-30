import './style.css';
import { showLoader, showWelcome, showMainApp } from './src/ui.js';
import { initializeApp } from './src/app.js';

document.addEventListener('DOMContentLoaded', () => {
    showLoader();

    setTimeout(() => {
        showWelcome(() => {
            showMainApp();
            initializeApp();
        });
    }, 2000);
});