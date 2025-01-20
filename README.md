# Flux Image Generator

A modern web application built with Next.js that provides an intuitive interface for generating AI images using the Flux API. The application offers advanced customization options and supports multiple Flux models. This is a BYOK (Bring Your Own Key) application, which means you can use your own Flux API key to generate images. Get it here [https://docs.bfl.ml/](https://docs.bfl.ml/)

## Features

- 🎨 Support for multiple Flux AI models:
  - Flux Pro 1.1
  - Flux Pro
  - Flux Dev
  - Flux Pro 1.1 Ultra
- 🛠️ Advanced image generation controls:
  - Customizable dimensions (width/height)
  - Aspect ratio selection for Ultra model
  - Adjustable guidance scale
  - Safety tolerance settings
  - Prompt upsampling option
  - Custom seed support
- 💫 Real-time image generation
- 📥 Direct image download capability
- 🎯 Responsive design with dark mode UI

## Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Flux API key

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd flux_image_gen
```

2. Install dependencies:
```bash
npm install
```

3. Configure your API key:
   - Create a copy of `example.config.json` and name it `config.json`
   - Add your Flux API key to the configuration file

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Usage

1. Select a Flux model from the dropdown menu
2. Enter your image generation prompt
3. Adjust generation parameters:
   - For standard models: Set width and height
   - For Ultra model: Choose aspect ratio
   - Configure additional parameters like guidance scale, safety tolerance, and steps
4. Click "Generate Image" to create your image
5. Use the download button to save generated images

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main image generation interface
│   └── api/            # API routes
├── lib/                # Utility functions
│   ├── flux-api.ts     # Flux API integration
│   └── config.ts       # Configuration management
└── public/             # Static assets
```

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - HTTP client
- [Flux API](https://flux.ai) - AI image generation service

## Environment Variables

The application requires a Flux API key for authentication. Configure this in your `.env.local` file:

```json
{
  "fluxKey": "your-flux-api-key"
}
```

## License

This project is licensed under the MIT License.
