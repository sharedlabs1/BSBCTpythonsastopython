// Initialize exercise management system
document.addEventListener('DOMContentLoaded', () => {
    setupExercises();
    setupNavigation();
    setupCodeBlocks();
    loadSavedProgress();
    setupKeyboardNavigation();
});

// Exercise Setup Functions
function setupExercises() {
    const sections = document.querySelectorAll('h2, h3');
    let exerciseCount = 0;

    sections.forEach((section) => {
        if (section.textContent.toLowerCase().includes('case study') ||
             section.textContent.toLowerCase().includes('lab'))  {
            exerciseCount++;
            const wrapper = document.createElement('div');
            wrapper.className = 'exercise-section';
            wrapper.dataset.exerciseId = `exercise-${exerciseCount}`;
            
            // Wrap the section
            section.parentNode.insertBefore(wrapper, section);
            wrapper.appendChild(section);

            // Move related content into wrapper
            let nextElement = wrapper.nextSibling;
            while (nextElement && 
                   nextElement.tagName !== 'H2' && 
                   nextElement.tagName !== 'H3') {
                const currentElement = nextElement;
                nextElement = nextElement.nextSibling;
                wrapper.appendChild(currentElement);
            }

            wrapper.appendChild(createCompleteButton(exerciseCount));
        }
    });

    updateProgressBar(exerciseCount);
}

function updateProgressBar(totalCount) {
    const container = document.querySelector('.progress-container');
    if (!container) return;

    const stats = container.querySelector('.progress-stats');
    if (stats) {
        const completedCount = document.querySelectorAll('.complete-button.completed').length;
        const percentage = Math.round((completedCount / totalCount) * 100);
        
        container.querySelector('.progress-fill').style.width = `${percentage}%`;
        stats.innerHTML = `
            <span>Exercises completed: ${completedCount}/${totalCount}</span>
            <span>${percentage}%</span>
        `;
    }
}

function createCompleteButton(number) {
    const button = document.createElement('button');
    button.className = 'complete-button';
    button.innerHTML = getButtonHTML();
    button.onclick = () => toggleCompletion(`exercise-${number}`);
    return button;
}

function getButtonHTML(completed = false) {
    return completed ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>Completed!</span>
    ` : `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>Mark Complete</span>
    `;
}

// Navigation Setup
function setupNavigation() {
    const nav = document.createElement('div');
    nav.className = 'exercise-navigation';
    nav.innerHTML = '<div class="nav-title">Exercise Navigation</div>';

    const exercises = document.querySelectorAll('.exercise-section');
    exercises.forEach((exercise, index) => {
        const title = exercise.querySelector('h2, h3').textContent;
        nav.appendChild(createNavigationItem(title, index, exercise.dataset.exerciseId));
    });

    document.body.appendChild(nav);
    addMobileNavToggle();
}

function createNavigationItem(title, index, exerciseId) {
    const item = document.createElement('div');
    item.className = 'nav-item';
    item.dataset.exerciseNav = exerciseId;
    item.innerHTML = `
        <span class="exercise-number">${index + 1}</span>
        <span class="exercise-title">${title}</span>
        <span class="trophy-icon">🏆</span>
    `;
    item.onclick = () => navigateToExercise(exerciseId);
    return item;
}

function addMobileNavToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16m-16 6h16"></path>
        </svg>
    `;
    toggle.onclick = toggleMobileNav;
    document.body.appendChild(toggle);
}

// Code Block Setup
function setupCodeBlocks() {
    document.querySelectorAll('pre').forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span>Copy</span>
        `;
        copyButton.onclick = () => copyCode(pre, copyButton);
        
        // Insert wrapper before pre and move pre into it
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(copyButton);
    });
}

// Copy functionality
async function copyCode(pre, button) {
    try {
        await navigator.clipboard.writeText(pre.textContent);
        button.classList.add('copied');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7"/>
            </svg>
            <span>Copied!</span>
        `;
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span>Copy</span>
            `;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy code:', err);
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Failed</span>
        `;
    }
}

// Exercise completion functions
function toggleCompletion(exerciseId) {
    const section = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    const button = section.querySelector('.complete-button');
    const navItem = document.querySelector(`[data-exercise-nav="${exerciseId}"]`);
    const isCompleted = button.classList.contains('completed');

    button.classList.toggle('completed');
    button.innerHTML = getButtonHTML(!isCompleted);
    
    if (navItem) {
        navItem.classList.toggle('completed');
    }

    saveProgress();
    updateProgressBar(document.querySelectorAll('.exercise-section').length);
    checkAllCompleted();
}

// Progress Management
function saveProgress() {
    const progress = {};
    document.querySelectorAll('.exercise-section').forEach(section => {
        const exerciseId = section.dataset.exerciseId;
        const isCompleted = section.querySelector('.complete-button').classList.contains('completed');
        progress[exerciseId] = isCompleted;
    });
    localStorage.setItem('exerciseProgress', JSON.stringify(progress));
}

function loadSavedProgress() {
    const saved = localStorage.getItem('exerciseProgress');
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            Object.entries(progress).forEach(([exerciseId, isCompleted]) => {
                if (isCompleted) {
                    const section = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
                    const navItem = document.querySelector(`[data-exercise-nav="${exerciseId}"]`);
                    if (section) {
                        const button = section.querySelector('.complete-button');
                        button.classList.add('completed');
                        button.innerHTML = getButtonHTML(true);
                    }
                    if (navItem) navItem.classList.add('completed');
                }
            });
            updateProgressBar(document.querySelectorAll('.exercise-section').length);
        } catch (e) {
            console.error('Error loading progress:', e);
            localStorage.removeItem('exerciseProgress');
        }
    }
}

// Navigation functions
function navigateToExercise(exerciseId) {
    const section = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateCurrentNavItem(exerciseId);
    }
}

function updateCurrentNavItem(exerciseId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('current', item.dataset.exerciseNav === exerciseId);
    });
}

function toggleMobileNav() {
    document.querySelector('.exercise-navigation').classList.toggle('active');
}

// Completion celebration
function checkAllCompleted() {
    const total = document.querySelectorAll('.exercise-section').length;
    const completed = document.querySelectorAll('.complete-button.completed').length;
    
    if (completed === total) {
        showCompletionCelebration();
    }
}

function showCompletionCelebration() {
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="celebration-trophy">🏆</div>
            <h2>Congratulations!</h2>
            <p>You've completed all exercises!</p>
            <button onclick="this.closest('.completion-modal').remove()">Continue Learning</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
}

// Keyboard Navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
        const sections = Array.from(document.querySelectorAll('.exercise-section'));
        const currentIndex = sections.findIndex(section => 
            section.getBoundingClientRect().top > 0
        );

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            if (currentIndex > 0) {
                navigateToExercise(sections[currentIndex - 1].dataset.exerciseId);
            }
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            if (currentIndex < sections.length - 1) {
                navigateToExercise(sections[currentIndex + 1].dataset.exerciseId);
            }
        }
    });
}