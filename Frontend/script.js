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
      // Screens
      this.startScreen = document.getElementById('start-screen');
      this.examScreen = document.getElementById('exam-screen');
      this.sessionInfo = document.getElementById('session-info');
      
      // Buttons
      this.startButton = document.getElementById('start-exam');
      this.endButton = document.getElementById('end-exam');
      this.mediaAccessButton = document.getElementById('grant-access');
      
      // Status elements
      this.sessionIdElement = document.getElementById('session-id');
      this.fullscreenStatus = document.getElementById('fullscreen-status');
      this.warningsList = document.getElementById('warnings-list');
      this.mediaStatus = document.getElementById('media-status');
      this.videoPreview = document.getElementById('video-preview');
    }
  
    attachEventListeners() {
      this.mediaAccessButton.addEventListener('click', () => this.requestMediaAccess());
      this.startButton.addEventListener('click', () => this.startExam());
      this.endButton.addEventListener('click', () => this.endExam());
      
      document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
      window.addEventListener('blur', () => this.handleWindowBlur());
      document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    }
  
    generateSessionId() {
      return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
      });
    }
  
    async requestMediaAccess() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        this.hasMediaAccess = true;
        this.videoPreview.srcObject = this.stream;
        this.updateMediaStatus();
        this.startButton.disabled = false;
        this.mediaAccessButton.classList.add('hidden');
        
        // Show success message
        this.mediaStatus.innerHTML = `
          <div class="status-item success">
            <div class="status-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Camera and Microphone Access Granted</span>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Failed to get media access:', error);
        this.mediaStatus.innerHTML = `
          <div class="status-item error">
            <div class="status-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span>Failed to access camera or microphone. Please ensure permissions are granted.</span>
            </div>
          </div>
        `;
      }
    }
  
    async startExam() {
      if (!this.hasMediaAccess) {
        alert('Please grant camera and microphone access before starting the exam.');
        return;
      }
  
      try {
        await document.documentElement.requestFullscreen();
        this.examSession.isActive = true;
        this.examSession.startTime = new Date();
        this.updateUI();
      } catch (error) {
        console.error('Failed to enter full screen:', error);
      }
    }
  
    endExam() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      this.examSession.isActive = false;
      this.hasMediaAccess = false;
      this.updateUI();
    }
  
    handleVisibilityChange() {
      if (this.examSession.isActive && document.hidden) {
        this.addWarning('Tab switched');
      }
    }
  
    handleWindowBlur() {
      if (this.examSession.isActive) {
        this.addWarning('Window switched');
      }
    }
  
    handleFullscreenChange() {
      this.isFullScreen = !!document.fullscreenElement;
      if (this.examSession.isActive && !this.isFullScreen) {
        this.addWarning('Exited full screen mode');
      }
      this.updateFullscreenStatus();
    }
  
    addWarning(description) {
      const warning = {
        id: this.generateSessionId(),
        timestamp: new Date(),
        description
      };
      this.examSession.warnings.push(warning);
      this.updateWarnings();
    }
  
    updateUI() {
      if (this.examSession.isActive) {
        this.startScreen.classList.add('hidden');
        this.examScreen.classList.remove('hidden');
        this.sessionInfo.classList.remove('hidden');
        this.sessionIdElement.textContent = `Session ID: ${this.examSession.id}`;
      } else {
        this.startScreen.classList.remove('hidden');
        this.examScreen.classList.add('hidden');
        this.sessionInfo.classList.add('hidden');
        this.examSession.warnings = [];
        this.updateWarnings();
        this.videoPreview.srcObject = null;
        this.mediaAccessButton.classList.remove('hidden');
        this.startButton.disabled = true;
        this.mediaStatus.innerHTML = '';
      }
    }
  
    updateFullscreenStatus() {
      this.fullscreenStatus.textContent = this.isFullScreen ? 'Active' : 'Inactive';
      this.fullscreenStatus.className = this.isFullScreen ? 'status-value active' : 'status-value inactive';
    }
  
    updateMediaStatus() {
      const mediaStatusElement = document.getElementById('media-access-status');
      mediaStatusElement.textContent = this.hasMediaAccess ? 'Active' : 'Inactive';
      mediaStatusElement.className = this.hasMediaAccess ? 'status-value active' : 'status-value inactive';
    }
  
    updateWarnings() {
      if (this.examSession.warnings.length === 0) {
        this.warningsList.innerHTML = '<p class="no-warnings">No warnings detected</p>';
        return;
      }
  
      this.warningsList.innerHTML = this.examSession.warnings
        .map(warning => `
          <div class="warning-item">
            <div class="warning-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
              </svg>
            </div>
            <div class="warning-content">
              <p>${warning.description}</p>
              <p>${warning.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
        `)
        .join('');
    }
  }
  
  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {function startCameraPreview() {
    const video = document.getElementById('video-preview');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
        })
        .catch(err => {
          console.error("Camera access denied: ", err);
        });
    } else {
      alert("Camera not supported by this browser.");
    }
  }
  
  // Call this inside your exam start logic
  document.getElementById('start-exam-btn')?.addEventListener('click', () => {
    startCameraPreview();
  });
    new ExamGuard();
  });