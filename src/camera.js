let stream = null;
let photoData = null;

export function initializeCamera() {
    const openCameraBtn = document.getElementById('openCameraBtn');
    const closeCameraBtn = document.getElementById('closeCameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const photoFileInput = document.getElementById('photoFileInput');

    openCameraBtn.addEventListener('click', startCamera);
    closeCameraBtn.addEventListener('click', stopCamera);
    captureBtn.addEventListener('click', capturePhoto);
    uploadPhotoBtn.addEventListener('click', () => photoFileInput.click());
    photoFileInput.addEventListener('change', handleFileUpload);
}

async function startCamera() {
    try {
        const cameraContainer = document.getElementById('cameraContainer');
        const video = document.getElementById('cameraVideo');

        stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });

        video.srcObject = stream;
        cameraContainer.classList.add('active');
    } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please check permissions or use the upload option.');
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('cameraVideo');

    video.srcObject = null;
    cameraContainer.classList.remove('active');
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const preview = document.getElementById('photoPreview');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    photoData = canvas.toDataURL('image/jpeg', 0.8);
    preview.src = photoData;
    preview.classList.add('show');

    stopCamera();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        photoData = e.target.result;
        const preview = document.getElementById('photoPreview');
        preview.src = photoData;
        preview.classList.add('show');
    };
    reader.readAsDataURL(file);
}

export function getPhotoData() {
    return photoData;
}

export function clearPhotoData() {
    photoData = null;
    const preview = document.getElementById('photoPreview');
    preview.src = '';
    preview.classList.remove('show');
}

export function cleanupCamera() {
    stopCamera();
}