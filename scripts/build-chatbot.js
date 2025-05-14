const fs = require('fs');
const path = require('path');

// Read the Chatbot component
const chatbotCode = fs.readFileSync(
  path.join(__dirname, '../app/components/Chatbot.js'),
  'utf8'
);

// Create the standalone script
const standaloneScript = `
(function() {
  // Create a container for the chatbot
  const container = document.createElement('div');
  container.id = 'chatbot-container';
  document.body.appendChild(container);

  // Load required dependencies
  const loadDependency = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Load dependencies and initialize chatbot
  Promise.all([
    loadDependency('https://unpkg.com/react@18/umd/react.production.min.js'),
    loadDependency('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'),
    loadDependency('https://unpkg.com/framer-motion@11.0.3/dist/framer-motion.min.js'),
    loadDependency('https://unpkg.com/react-icons@5.0.1/fi/index.js')
  ]).then(() => {
    // Initialize the chatbot
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(Chatbot));
  }).catch(console.error);
})();
`;

// Write the standalone script
fs.writeFileSync(
  path.join(__dirname, '../public/chatbot.js'),
  standaloneScript
); 