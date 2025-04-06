class ExamGuard {
  constructor() {
    this.examSession = {
      id: this.generateSessionId(),
      startTime: null,
      warnings: [],
      isActive: false
    };

    this.isFullScreen = false;
    this.hasMediaAccess = false;
    this.stream = null;

    this.initializeElements();
    this.attachEventListeners();
  }

  initializeElements() {
    this.startScreen = document.getElementById('start-screen');
    this.examScreen = document.getElementById('exam-screen');
    this.sessionInfo = document.getElementById('session-info');

    this.startButton = document.getElementById('start-exam');
    this.endButton = document.getElementById('end-exam');
    this.mediaAccessButton = document.getElementById('grant-access');

    this.sessionIdElement = document.getElementById('session-id');
    this.fullscreenStatus = document.getElementById('fullscreen-status');
    this.mediaStatus = document.getElementById('media-status');
    this.warningsList = document.getElementById('warnings-list');
    this.videoPreview = document.getElementById('video-preview');
        this.videoPreviewExam = document.getElementById('video-preview-exam'); // from exam screen

  }

  attachEventListeners() {
    this.mediaAccessButton.addEventListener('click', () => this.requestMediaAccess());
    this.startButton.addEventListener('click', () => this.startExam());
    this.endButton.addEventListener('click', () => this.endExam());

    document.addEventListener('visibilitychange', () => this.onVisibilityChange());
    window.addEventListener('blur', () => this.onWindowBlur());
    document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
  }

  generateSessionId() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16));
  }

async requestMediaAccess() {
    try {
        // Request media access (camera & mic)
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.hasMediaAccess = true;

        // Set video preview to the stream
        this.videoPreview.srcObject = this.stream;
        this.videoPreview.play();

        this.videoPreviewExam.srcObject = this.stream;
this.videoPreviewExam.play();

        // Update media status
        this.updateMediaStatus();

        // Enable the start button
        this.startButton.disabled = false;

        // Hide the media access button on the start screen
        this.mediaAccessButton.classList.add('hidden');
        this.mediaStatus.innerHTML = this.createStatusItem('Camera and Microphone Access Granted', 'success');
    } catch (error) {
        console.error('Media access failed:', error);
        this.mediaStatus.innerHTML = this.createStatusItem('Failed to access camera or microphone.', 'error');
    }
}


  async startExam() {
    if (!this.hasMediaAccess) return alert('Grant camera/microphone access first.');
    try {
      await document.documentElement.requestFullscreen();
      this.examSession.isActive = true;
      this.examSession.startTime = new Date();
      this.updateUI();
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }

  endExam() {
    if (document.fullscreenElement) document.exitFullscreen();
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.examSession.isActive = false;
    this.hasMediaAccess = false;
    this.updateUI();
  }

  onVisibilityChange() {
    if (this.examSession.isActive && document.hidden) this.addWarning('Tab switched');
  }

  onWindowBlur() {
    if (this.examSession.isActive) this.addWarning('Window switched');
  }

  onFullscreenChange() {
    this.isFullScreen = !!document.fullscreenElement;
    if (this.examSession.isActive && !this.isFullScreen) this.addWarning('Exited full screen mode');
    this.updateFullscreenStatus();
  }

  addWarning(message) {
    this.examSession.warnings.push({
      id: this.generateSessionId(),
      timestamp: new Date(),
      description: message
    });
    this.updateWarnings();
  }

updateUI() {
    if (this.examSession.isActive) {
        // Hide start-screen and show exam-screen
        this.startScreen.classList.add('hidden');
        this.examScreen.classList.remove('hidden');
        this.sessionInfo.classList.remove('hidden');
        this.sessionIdElement.textContent = `Session ID: ${this.examSession.id}`;
    } else {
        // Hide exam-screen and show start-screen
        this.startScreen.classList.remove('hidden');
        this.examScreen.classList.add('hidden');
        this.sessionInfo.classList.add('hidden');
        this.examSession.warnings = [];
        this.updateWarnings();

        // Stop the video stream when the exam ends
        this.videoPreview.srcObject = null;

        // Reset button states
        this.mediaAccessButton.classList.remove('hidden');
        this.startButton.disabled = true;
        this.mediaStatus.innerHTML = '';
    }
}


  updateFullscreenStatus() {
    const statusText = this.isFullScreen ? 'Active' : 'Inactive';
    const className = this.isFullScreen ? 'status-value active' : 'status-value inactive';
    this.fullscreenStatus.textContent = statusText;
    this.fullscreenStatus.className = className;
  }

  updateMediaStatus() {
    const el = document.getElementById('media-access-status');
    const active = this.hasMediaAccess;
    el.textContent = active ? 'Active' : 'Inactive';
    el.className = active ? 'status-value active' : 'status-value inactive';
  }

  updateWarnings() {
    if (this.examSession.warnings.length === 0) {
      this.warningsList.innerHTML = '<p class="no-warnings">No warnings detected</p>';
      return;
    }
    this.warningsList.innerHTML = this.examSession.warnings.map(w => `
      <div class="warning-item">
        <div class="warning-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
          </svg>
        </div>
        <div class="warning-content">
          <p>${w.description}</p>
          <p>${w.timestamp.toLocaleTimeString()}</p>
        </div>
      </div>`).join('');
  }

  createStatusItem(text, type) {
    const icon = type === 'success'
      ? `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`
      : `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`;
    return `
      <div class="status-item ${type}">
        <div class="status-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${icon}
          </svg>
          <span>${text}</span>
        </div>
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ExamGuard();
});
