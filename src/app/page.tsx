'use client';

import { useState } from 'react';
import { generateImage, FLUX_MODELS, type FluxModel } from '@/lib/flux-api';

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<FluxModel>('Flux Pro 1.1');

  // Advanced settings
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [steps, setSteps] = useState(20);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [guidance, setGuidance] = useState(3);
  const [safetyTolerance, setSafetyTolerance] = useState(2);
  const [promptUpsampling, setPromptUpsampling] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isUltraModel = selectedModel === 'Flux Pro 1.1 Ultra';
      const imageData = await generateImage({
        prompt,
        ...(isUltraModel ? { aspect_ratio: aspectRatio } : { width, height }),
        steps,
        seed: seed || undefined,
        model: selectedModel,
        guidance,
        prompt_upsampling: promptUpsampling,
        safety_tolerance: safetyTolerance,
        output_format: 'jpeg'
      });

      setGeneratedImage(imageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (generatedImage) {
      try {
        // Fetch the image
        const response = await fetch(generatedImage);
        if (!response.ok) throw new Error('Failed to download image');
        
        // Get the blob
        const blob = await response.blob();
        
        // Create object URL
        const url = window.URL.createObjectURL(blob);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `flux-image-${Date.now()}.jpg`; // Using .jpg since we're generating jpegs
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to download image:', err);
        setError('Failed to download image. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white">Flux Image Generator</h1>
          <p className="mt-4 text-xl text-gray-300">Create stunning images with AI</p>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg p-8 border border-gray-700">
          <div className="space-y-6">
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-200">
                Model
              </label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as FluxModel)}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {Object.keys(FLUX_MODELS).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-200">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                rows={3}
                placeholder="Describe the image you want to generate..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {selectedModel === 'Flux Pro 1.1 Ultra' ? (
                <div className="col-span-2">
                  <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-200">
                    Aspect Ratio
                  </label>
                  <select
                    id="aspectRatio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    <option value="1:1">Square (1:1)</option>
                    <option value="4:3">Standard (4:3)</option>
                    <option value="16:9">Widescreen (16:9)</option>
                    <option value="3:2">Portrait (3:2)</option>
                    <option value="2:3">Landscape (2:3)</option>
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-200">
                      Width
                    </label>
                    <input
                      type="number"
                      id="width"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      min={64}
                      max={2048}
                      step={64}
                    />
                  </div>

                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-200">
                      Height
                    </label>
                    <input
                      type="number"
                      id="height"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      min={64}
                      max={2048}
                      step={64}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="guidance" className="block text-sm font-medium text-gray-200">
                  Guidance Scale
                </label>
                <input
                  type="number"
                  id="guidance"
                  value={guidance}
                  onChange={(e) => setGuidance(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  min={1}
                  max={20}
                  step={0.5}
                />
              </div>

              <div>
                <label htmlFor="safetyTolerance" className="block text-sm font-medium text-gray-200">
                  Safety Tolerance
                </label>
                <input
                  type="number"
                  id="safetyTolerance"
                  value={safetyTolerance}
                  onChange={(e) => setSafetyTolerance(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  min={0}
                  max={3}
                  step={1}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={promptUpsampling}
                  onChange={(e) => setPromptUpsampling(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-opacity-50 h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-200">Enable Prompt Upsampling</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="steps" className="block text-sm font-medium text-gray-200">
                  Steps
                </label>
                <input
                  type="number"
                  id="steps"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  min={1}
                  max={100}
                />
              </div>

              <div>
                <label htmlFor="seed" className="block text-sm font-medium text-gray-200">
                  Seed (Optional)
                </label>
                <input
                  type="number"
                  id="seed"
                  value={seed ?? ''}
                  onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleGenerateImage}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>

        {generatedImage && (
          <div className="bg-gray-800 shadow-xl rounded-lg p-8 text-center border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Generated Image</h2>
            <div className="flex justify-center mb-4">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <button
              onClick={handleDownloadImage}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
