# AI Chatbot

A simple, modern chatbot component with AI integration.

## Features

- 💬 Real-time chat with AI
- 🎨 Clean, modern UI
- 📱 Mobile-friendly
- 🎯 Toggleable chat window

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
OPENROUTER_API_KEY=your_api_key_here
```

3. Get your API key from [OpenRouter](https://openrouter.ai/)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Basic Usage

Add the chatbot to any React component:

```jsx
import Chatbot from './components/Chatbot';

function YourComponent() {
  return (
    <div>
      <Chatbot />
    </div>
  );
}
```

## Required Dependencies

```bash
npm install framer-motion react-icons react-markdown
```

## Integration into React Website

### Method 1: Using the Component Directly

1. Copy the following files to your React project:
   - `app/components/Chatbot.js`
   - `app/api/chat/route.ts`

2. Install the required dependencies:
```bash
npm install framer-motion react-icons react-markdown
```

3. Import and use the Chatbot component:
```jsx
import Chatbot from './components/Chatbot';

function YourComponent() {
  return (
    <div>
      {/* Your existing content */}
      <Chatbot />
    </div>
  );
}
```

### Method 2: Using the Deployed Version

1. Deploy this project to Vercel:
   - Push to GitHub
   - Import to Vercel
   - Add environment variables
   - Deploy

2. Add the chatbot to your website:
```html
<script src="https://your-vercel-deployment-url.vercel.app/chatbot.js"></script>
```

## Customization

You can customize the chatbot by modifying the following in `Chatbot.js`:

### Colors
```jsx
// Change button color
className="bg-blue-500" // to any Tailwind color

// Change message bubbles
className="bg-gray-100" // for bot messages
className="bg-blue-500" // for user messages
```

### Size and Position
```jsx
// Change size
className="w-96 h-[500px]" // width and height

// Change position
className="fixed bottom-4 right-4" // position from bottom and right
```

### Message Styling
```jsx
// In the MessageContent component
<ReactMarkdown
  components={{
    p: ({ children }) => <p className="mb-2">{children}</p>,
    code: ({ children }) => (
      <code className="bg-gray-200 rounded px-1 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    // Add more custom components as needed
  }}
>
  {content}
</ReactMarkdown>
```

## API Configuration

The chatbot uses OpenRouter AI API. Update the following in `route.ts`:

```typescript
const response = await axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: 'deepseek/deepseek-r1:free',
    messages: [{ role: 'user', content: userMessage }],
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://www.sitename.com',
      'X-Title': 'SiteName',
      'Content-Type': 'application/json',
    },
  }
);
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
ai-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API endpoint
│   │   └── components/
│   │       └── Chatbot.js      # Main chatbot component
│   │   ├── globals.css         # Global styles
│   │   └── page.js             # Main page
├── public/                 # Static files
└── package.json           # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the maintainers.
