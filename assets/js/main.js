// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }
});

// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const mobileMenu = document.querySelector('.mobile-menu');
        mobileMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
    }
});

// Handle Netlify form submissions
document.querySelectorAll('.waitlist-form').forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        const formGroup = form.querySelector('.form-group');
        
        // Show submitting state
        form.classList.add('submitting');
        submitButton.textContent = 'Joining...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                // Success
                formGroup.style.display = 'none';
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.textContent = '🎉 You\'re on the list! We\'ll notify you when FlowDeck launches.';
                form.appendChild(successMsg);
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    form.reset();
                    formGroup.style.display = '';
                    successMsg.remove();
                    form.classList.remove('submitting');
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Something went wrong. Please try again.';
            form.appendChild(errorMsg);
            
            form.classList.remove('submitting');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            setTimeout(() => {
                errorMsg.remove();
            }, 3000);
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});


// Code typing animation (simple version)
const codeElement = document.querySelector('.code-content code');
if (codeElement) {
    const originalContent = codeElement.innerHTML;
    let currentIndex = 0;

    // Reset content
    codeElement.innerHTML = '';

    function typeCode() {
        if (currentIndex < originalContent.length) {
            codeElement.innerHTML = originalContent.substring(0, currentIndex) + '<span class="cursor">|</span>';
            currentIndex++;
            setTimeout(typeCode, 30);
        } else {
            // Remove cursor after typing is complete
            codeElement.innerHTML = originalContent;
        }
    }

    // Start typing animation after a delay
    setTimeout(typeCode, 1000);
}

// Typing animation for editor names
const editors = ['Cursor', 'VS Code', 'Windsurf'];
let currentEditorIndex = 0;
let currentText = '';
let currentChar = 0;
let isDeleting = false;
let typeTimer;

function typeEffect() {
    const element = document.getElementById('editor-name');
    if (!element) return;

    const fullText = editors[currentEditorIndex];

    if (isDeleting) {
        // Deleting text
        currentText = fullText.substring(0, currentChar - 1);
        currentChar--;
    } else {
        // Typing text
        currentText = fullText.substring(0, currentChar + 1);
        currentChar++;
    }

    element.textContent = currentText;

    let typeSpeed = 100;

    if (isDeleting) {
        typeSpeed = 50;
    }

    if (!isDeleting && currentChar === fullText.length) {
        // Pause at end
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && currentChar === 0) {
        // Move to next word
        isDeleting = false;
        currentEditorIndex = (currentEditorIndex + 1) % editors.length;
        typeSpeed = 500;
    }

    typeTimer = setTimeout(typeEffect, typeSpeed);
}

// Start the animation
document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('editor-name');
    if (element) {
        // Set initial text to prevent empty state
        element.textContent = editors[0];

        // Start typing effect after a short delay
        setTimeout(() => {
            currentChar = editors[0].length;
            isDeleting = true;
            typeEffect();
        }, 2000);
    }
});

// Rotate testimonials
function rotateTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length === 0) return;

    let currentIndex = 0;

    setInterval(() => {
        // Remove active from current
        testimonials[currentIndex].classList.remove('active');

        // Move to next testimonial
        currentIndex = (currentIndex + 1) % testimonials.length;

        // Add active to new current
        testimonials[currentIndex].classList.add('active');
    }, 10000); // Change every 10 seconds
}

// Start testimonial rotation when page loads
document.addEventListener('DOMContentLoaded', rotateTestimonials);

// Signup Modal Functionality
const signupModal = document.getElementById('signupModal');
const signupForm = document.getElementById('signupForm');
const modalClose = document.querySelector('.signup-modal-close');

// Function to open the signup modal
function openSignupModal() {
    signupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Function to close the signup modal
function closeSignupModal() {
    signupModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking the close button
if (modalClose) {
    modalClose.addEventListener('click', closeSignupModal);
}

// Close modal when clicking outside
signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) {
        closeSignupModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && signupModal.classList.contains('active')) {
        closeSignupModal();
    }
});

// Handle form submission to Lemon Squeezy
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = signupForm.querySelector('.signup-form-submit');
    const originalButtonText = submitButton.textContent;
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Joining...';

    // Remove any existing messages
    const existingMessages = signupForm.parentElement.querySelectorAll('.signup-success-message, .signup-error-message');
    existingMessages.forEach(msg => msg.remove());

    try {
        // Submit to Lemon Squeezy signup form endpoint
        const formData = new FormData();
        formData.append('email', email);
        formData.append('name', name);

        const response = await fetch('https://flowdeck.lemonsqueezy.com/email-subscribe/external', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Success - Hide form and show success message
            signupForm.style.display = 'none';

            const successMessage = document.createElement('div');
            successMessage.className = 'signup-success-message';
            successMessage.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <h3 style="color: #10b981; font-size: 1.5rem; margin-bottom: 0.5rem;">Thank You</h3>
                    <p style="color: #a1a1aa;">You're on the list!</p>
                </div>
            `;
            signupForm.parentElement.insertBefore(successMessage, signupForm);

            // Close modal and reset form after 4 seconds
            setTimeout(() => {
                closeSignupModal();
                successMessage.remove();
                signupForm.style.display = '';
                signupForm.reset();
            }, 4000);
        } else {
            throw new Error(`Subscription failed with status ${response.status}: ${responseText}`);
        }
    } catch (error) {
        console.error('Subscription error:', error);
        console.error('Error details:', error.message);

        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'signup-error-message';
        errorMessage.textContent = 'Something went wrong. Please try again or email us at support@flowdeck.studio';
        signupForm.parentElement.insertBefore(errorMessage, signupForm.nextSibling);

        // Remove error message after 5 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Open modal when clicking any open-signup button
document.addEventListener('DOMContentLoaded', () => {
    const openButtons = document.querySelectorAll('.open-signup');
    openButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openSignupModal();
        });
    });

    // Check if URL has #join hash and open modal automatically
    if (window.location.hash === '#join') {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
            openSignupModal();
            // Optionally remove the hash from URL without causing page jump
            history.replaceState(null, null, window.location.pathname + window.location.search);
        }, 100);
    }
});

// Listen for hash changes while on the page
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#join') {
        openSignupModal();
        // Remove the hash from URL without causing page jump
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
});

// ================================================================
// PRICING
// ================================================================
// Pricing is annual-only. Checkout URLs live in templates via `site.checkout_url_yearly`.

// ================================================================
// CLI FEATURES: Animate cards on scroll
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    const cliCards = document.querySelectorAll('.cli-feature-card');
    if (cliCards.length === 0) return;

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cliCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        cardObserver.observe(card);
    });
});

// ================================================================
// HERO TERMINAL: Typing animation
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.querySelector('.hero-cli .terminal-body');
    if (!terminalBody) return;

    const lines = [
        { text: 'macBook ~% ', type: 'shell-prompt', delay: 3000 },
        { text: 'flowdeck -i', type: 'shell-typed', delay: 500 },
        { text: '', type: 'clear', delay: 0 },
        { text: '<div style="line-height: 18px; margin: 0; padding: 0;"><span style="display: inline-block; width: 12px; height: 18px; background: #c88c50; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #b47864; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #967382; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #7878a0; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #5a7db9; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #4682c8; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #4682c8; opacity: 0.7; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #4682c8; opacity: 0.5; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #4682c8; opacity: 0.3; vertical-align: middle;"></span>  <span style="color: #4682c8; font-weight: 600;">FlowDeck</span> <span style="color: #9ca3af;">Interactive mode</span></div>', type: 'logo-html', delay: 0 },
        { text: '<div style="line-height: 18px; margin: 0; padding: 0;"><span style="display: inline-block; width: 12px; height: 18px; background: #c88c50; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #b47864; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #967382; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #7878a0; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #5a7db9; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #4682c8; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #4682c8; opacity: 0.7; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #4682c8; opacity: 0.5; vertical-align: middle;"></span><span style="display: inline-block; width: 12px; height: 18px; background: #4682c8; opacity: 0.3; vertical-align: middle;"></span>  <span style="color: #71717a;">v 1.5.0</span></div>', type: 'logo-html', delay: 0 },
        { text: '', type: 'blank', delay: 300 },
        { text: 'App:     FlowDeck Demo', type: 'output', delay: 0 },
        { text: 'Scheme:  iOS', type: 'output', delay: 0 },
        { text: 'Target:  iPhone 17 Pro', type: 'output', delay: 0 },
        { text: 'Config:  Debug', type: 'output', delay: 0 },
        { text: '', type: 'blank', delay: 0 },
        { text: '', type: 'cursor-blink', delay: 2000 },
        { text: '', type: 'blank', delay: 0 },
        { text: '> R', type: 'user-prompt-typed', delay: 1000 },        
        { text: '', type: 'blank', delay: 0 },
        { text: '◆◆ RUN FlowDeck Demo on iPhone 17 Pro...', type: 'output', delay: 600 },
        { text: '', type: 'blank', delay: 0 },
        { text: '🚀 Build Started', type: 'output', delay: 0 },
        { text: '', type: 'blank', delay: 0 },
        { text: '   Workspace: FlowDeck.xcworkspace', type: 'output', delay: 0 },
        { text: '   Scheme: iOS', type: 'output', delay: 0 },
        { text: '   Configuration: Debug', type: 'output', delay: 0 },
        { text: '   Platform: iOS 26.2', type: 'output', delay: 0 },
        { text: '   Device: 242B5191-EA4A-4762-97C7-CEA18B3FFE48', type: 'output', delay: 1000 },
        { text: '', type: 'blank', delay: 0 },
        { text: 'Resolving packages...', type: 'output', delay: 3000 },
        { text: 'Compiling...', type: 'output', delay: 2000 },
        { text: '', type: 'blank', delay: 300 },
        { text: '✅ Build Completed', type: 'success', delay: 500 },
        { text: '', type: 'blank', delay: 2000 },
        { text: '📦 Preparing to launch App...', type: 'output', delay: 2000 },
        { text: '', type: 'blank', delay: 0 },
        { text: 'Running health check...', type: 'output', delay: 1000 },
        { text: 'Preparing installation...', type: 'output', delay: 1500 },
        { text: 'Cleaning up previous instances...', type: 'output', delay: 1800 },
        { text: 'Installing app..', type: 'output', delay: 3500 },
        { text: 'Launching app...', type: 'output', delay: 2000 },
        { text: 'Getting process ID...', type: 'output', delay: 1000 },
        { text: '', type: 'blank', delay: 300 },
        { text: '✅ App Launched Successfully', type: 'success', delay: 0 },
        { text: '', type: 'blank', delay: 0 },
        { text: '   App ID: AA3EDEE0', type: 'output', delay: 0 },
        { text: '   Process ID: 47972', type: 'output', delay: 0 },
        { text: '   Bundle ID: com.flowdeck.demo', type: 'output', delay: 0 },
        { text: '   Target: Daniel\'s iPhone', type: 'output', delay: 0 },
        { text: '   Build Logs: .flowdeck/build.log', type: 'output', delay: 0 },
        { text: '   Runtime Logs: .flowdeck/runtime.log', type: 'output', delay: 0 },
        { text: '', type: 'blank', delay: 0 },
        { text: '   Press \'L\' to stream logs', type: 'output', delay: 0 },
        { text: '   Press \'X\' to stop this app', type: 'output', delay: 0 },
        { text: '', type: 'blank', delay: 0 },
        { text: '', type: 'cursor-blink', delay: 5000 },
        { text: '', type: 'blank', delay: 0 },
        { text: '> X', type: 'user-prompt-typed', delay: 1000 },    
        { text: '◆◆ STOP FlowDeck Demo', type: 'output', delay: 600 },
        { text: '✓ Stopped com.flowdeck.demo', type: 'output', delay: 1000 },
        { text: '', type: 'cursor-blink', delay: 5000 },

    ];
    let currentLine = 0;
    let currentChar = 0;
    let displayedLines = [];

    function renderTerminal() {
        let html = '';
        displayedLines.forEach((line, index) => {
            if (line.type === 'blank') {
                html += '\n';
            } else if (line.type === 'cursor-blink') {
                html += '<span class="user-prompt">&gt;</span> <span class="cursor-blink">▌</span>\n';
            } else if (line.type === 'logo') {
                html += `<span class="logo">${line.text}</span>\n`;
            } else if (line.type === 'logo-html') {
                html += `${line.text}`;
            } else if (line.type === 'divider') {
                html += `<span class="divider">${line.text}</span>\n`;
            } else if (line.type === 'shell-prompt') {
                const typedCommand = line.typedCommand || '';
                const isTyping = currentLine < lines.length && lines[currentLine].type === 'shell-typed';
                const cursor = isTyping && currentChar < lines[currentLine].text.length ? '<span class="cursor-blink">▌</span>' : '';
                const showInitialCursor = !typedCommand && currentLine === 0 ? '<span class="cursor-blink">▌</span>' : '';
                html += `<span class="output">${line.text}${typedCommand}${cursor}${showInitialCursor}</span>\n`;
            } else if (line.type === 'user-prompt' || line.type === 'user-prompt-typed') {
                html += `<span class="user-prompt">${line.text}</span>\n`;
            } else if (line.type === 'thinking') {
                html += `<span class="thinking">${line.text}</span>\n`;
            } else if (line.type === 'ai-response') {
                html += `<span class="ai-response">${line.text}</span>\n`;
            } else if (line.type === 'command') {
                html += `<span class="prompt">$</span> <span class="command">${line.text.substring(2)}</span>\n`;
            } else if (line.type === 'success') {
                html += `<span class="success">${line.text}</span>\n`;
            } else if (line.type === 'error') {
                html += `<span class="error">${line.text}</span>\n`;
            } else if (line.type === 'log') {
                html += `<span class="output" style="color: #60a5fa;">${line.text}</span>\n`;
            } else {
                html += `<span class="output">${line.text}</span>\n`;
            }
        });
        terminalBody.innerHTML = html;
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function typeNextLine() {
        if (currentLine >= lines.length) {
            // Restart after a pause
            setTimeout(() => {
                currentLine = 0;
                displayedLines = [];
                typeNextLine();
            }, 4000);
            return;
        }

        const line = lines[currentLine];

        if (line.type === 'clear') {
            // Clear the screen
            displayedLines = [];
            renderTerminal();
            currentLine++;
            setTimeout(typeNextLine, line.delay);
        } else if (line.type === 'shell-prompt') {
            // Show prompt instantly (will render with blinking cursor)
            // Create a copy to avoid modifying the original
            displayedLines.push({ ...line });
            renderTerminal();
            currentLine++;
            setTimeout(typeNextLine, line.delay);
        } else if (line.type === 'shell-typed') {
            // Type command after the prompt on the same line
            if (currentChar === 0) {
                // Find the last shell-prompt and append to it
                const lastPromptIndex = displayedLines.findIndex(l => l.type === 'shell-prompt');
                if (lastPromptIndex >= 0) {
                    displayedLines[lastPromptIndex].typedCommand = '';
                }
            }

            const lastPromptIndex = displayedLines.findIndex(l => l.type === 'shell-prompt');
            if (currentChar < line.text.length) {
                if (lastPromptIndex >= 0) {
                    displayedLines[lastPromptIndex].typedCommand = line.text.substring(0, currentChar + 1);
                }
                currentChar++;
                renderTerminal();
                setTimeout(typeNextLine, 60);
            } else {
                currentChar = 0;
                currentLine++;
                setTimeout(typeNextLine, line.delay);
            }
        } else if (line.type === 'command' || line.type === 'user-prompt-typed') {
            // Type character by character
            if (currentChar === 0) {
                // Replace cursor-blink line if it exists
                const cursorIndex = displayedLines.findIndex(l => l.type === 'cursor-blink');
                if (cursorIndex >= 0) {
                    displayedLines[cursorIndex] = { text: '', type: line.type };
                } else {
                    displayedLines.push({ text: '', type: line.type });
                }
            }

            // Find the LAST line of this type (in case we have multiple)
            let lineIndex = -1;
            for (let i = displayedLines.length - 1; i >= 0; i--) {
                if (displayedLines[i].type === line.type) {
                    lineIndex = i;
                    break;
                }
            }

            if (currentChar < line.text.length && lineIndex >= 0) {
                displayedLines[lineIndex].text = line.text.substring(0, currentChar + 1);
                currentChar++;
                renderTerminal();
                setTimeout(typeNextLine, 40);
            } else {
                currentChar = 0;
                currentLine++;
                setTimeout(typeNextLine, line.delay);
            }
        } else {
            // Output lines appear instantly
            const cursorIndex = displayedLines.findIndex(l => l.type === 'cursor-blink');

            // Skip blank lines that come immediately after cursor-blink
            if (line.type === 'blank' && cursorIndex >= 0 && cursorIndex === displayedLines.length - 1) {
                // Don't add this blank line, just move to next
                currentLine++;
                setTimeout(typeNextLine, line.delay);
            } else if (line.type !== 'cursor-blink') {
                // Replace cursor-blink line if it exists
                if (cursorIndex >= 0) {
                    displayedLines[cursorIndex] = line;
                } else {
                    displayedLines.push(line);
                }
                renderTerminal();
                currentLine++;
                setTimeout(typeNextLine, line.delay);
            } else {
                // Add cursor-blink line
                displayedLines.push(line);
                renderTerminal();
                currentLine++;
                setTimeout(typeNextLine, line.delay);
            }
        }
    }

    // Start animation immediately
    typeNextLine();
});

// ================================================================
// COPY BUTTON FUNCTIONALITY
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.getAttribute('data-copy');
            const tooltip = button.querySelector('.copy-tooltip');

            try {
                await navigator.clipboard.writeText(textToCopy);

                // Show tooltip
                tooltip.classList.add('show');

                // Change icon temporarily
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-copy');
                    icon.classList.add('fa-check');
                }

                // Reset after 2 seconds
                setTimeout(() => {
                    tooltip.classList.remove('show');
                    if (icon) {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-copy');
                    }
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    tooltip.classList.add('show');
                    setTimeout(() => tooltip.classList.remove('show'), 2000);
                } catch (e) {
                    console.error('Fallback copy failed:', e);
                }
                document.body.removeChild(textarea);
            }
        });
    });
});

// ================================================================
// INSTALL MODAL FUNCTIONALITY
// ================================================================

const installModal = document.getElementById('installModal');
const installModalClose = document.querySelector('.install-modal-close');

// Function to open the install modal
function openInstallModal() {
    if (installModal) {
        installModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Function to close the install modal
function closeInstallModal() {
    if (installModal) {
        installModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking the close button
if (installModalClose) {
    installModalClose.addEventListener('click', closeInstallModal);
}

// Close modal when clicking outside
if (installModal) {
    installModal.addEventListener('click', (e) => {
        if (e.target === installModal) {
            closeInstallModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && installModal && installModal.classList.contains('active')) {
        closeInstallModal();
    }
});

// Open modal when clicking any open-install-modal button
document.addEventListener('DOMContentLoaded', () => {
    const openButtons = document.querySelectorAll('.open-install-modal');
    openButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openInstallModal();
        });
    });
});