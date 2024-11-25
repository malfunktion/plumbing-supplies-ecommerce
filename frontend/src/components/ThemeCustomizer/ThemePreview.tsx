import React from 'react';
import { ThemeDocument } from '../../../../backend/src/models/theme';

interface ThemePreviewProps {
  theme: ThemeDocument;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  return (
    <div className="dora-card p-6 space-y-8">
      {/* Typography Preview */}
      <div className="space-y-4">
        <h3 className="dora-heading text-lg font-semibold">Typography</h3>
        <div className="space-y-2">
          <h1 style={{ fontFamily: theme.typography.fontFamily.display }} className="text-3xl">
            Display Heading
          </h1>
          <h2 style={{ fontFamily: theme.typography.fontFamily.sans }} className="text-2xl">
            Sans Heading
          </h2>
          <p style={{ fontFamily: theme.typography.fontFamily.serif }} className="text-base">
            Serif paragraph text with different styles and weights to showcase the typography system.
          </p>
          <code style={{ fontFamily: theme.typography.fontFamily.mono }} className="text-sm">
            Monospace text for code examples
          </code>
        </div>
      </div>

      {/* Color Palette Preview */}
      <div className="space-y-4">
        <h3 className="dora-heading text-lg font-semibold">Color Palette</h3>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(theme.colors.primary).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="h-12 w-full rounded"
                style={{ backgroundColor: value }}
              />
              <span className="text-xs mt-1">{key}</span>
            </div>
          ))}
        </div>
        
        {/* Accent Colors */}
        <div className="grid grid-cols-4 gap-2">
          {['accent', 'success', 'warning', 'error'].map(colorType => (
            <div key={colorType} className="text-center">
              <div
                className="h-8 w-full rounded"
                style={{ backgroundColor: theme.colors[colorType]?.default }}
              />
              <span className="text-xs mt-1 capitalize">{colorType}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Component Preview */}
      <div className="space-y-4">
        <h3 className="dora-heading text-lg font-semibold">Components</h3>
        
        {/* Buttons */}
        <div className="space-x-2">
          <button
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.colors.primary.default,
              color: theme.colors.text.onPrimary,
              padding: theme.components.button.padding.default,
              borderRadius: theme.components.button.borderRadius.default,
              fontSize: theme.components.button.fontSize.default,
              fontWeight: theme.components.button.fontWeight,
              transition: `all ${theme.effects.transitions.duration.default} ${theme.effects.transitions.easing.default}`,
            }}
          >
            Primary Button
          </button>
          <button
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: theme.colors.background.default,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border.default}`,
              padding: theme.components.button.padding.default,
              borderRadius: theme.components.button.borderRadius.default,
              fontSize: theme.components.button.fontSize.default,
              fontWeight: theme.components.button.fontWeight,
            }}
          >
            Secondary Button
          </button>
        </div>

        {/* Input */}
        <div>
          <input
            type="text"
            placeholder="Input field"
            className="w-full"
            style={{
              padding: theme.components.input.padding.default,
              borderRadius: theme.components.input.borderRadius.default,
              fontSize: theme.components.input.fontSize.default,
              borderWidth: theme.components.input.borderWidth,
              borderColor: theme.colors.border.default,
              backgroundColor: theme.colors.background.input,
              color: theme.colors.text.primary,
            }}
          />
        </div>

        {/* Card */}
        <div
          className="p-4"
          style={{
            padding: theme.components.card.padding.default,
            borderRadius: theme.components.card.borderRadius.default,
            boxShadow: theme.components.card.shadow,
            backgroundColor: theme.colors.surface.default,
          }}
        >
          <h4 className="font-semibold mb-2">Card Component</h4>
          <p className="text-sm">
            This is a sample card component showcasing the theme's surface colors,
            shadows, and spacing.
          </p>
        </div>
      </div>

      {/* Effects Preview */}
      <div className="space-y-4">
        <h3 className="dora-heading text-lg font-semibold">Effects</h3>
        
        {/* Shadows */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(theme.effects.shadows).map(([key, value]) => (
            <div
              key={key}
              className="h-16 rounded bg-white"
              style={{ boxShadow: value }}
            >
              <span className="text-xs p-2 block">{key}</span>
            </div>
          ))}
        </div>

        {/* Blur Effects */}
        <div className="relative h-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-primary-500"
              style={{
                backgroundColor: theme.colors.primary.default,
                opacity: theme.effects.opacity.overlay,
                backdropFilter: `blur(${theme.effects.blur.default})`,
              }}
            />
            <span className="relative text-white">Blur & Opacity</span>
          </div>
        </div>
      </div>

      {/* Spacing Preview */}
      <div className="space-y-4">
        <h3 className="dora-heading text-lg font-semibold">Spacing & Grid</h3>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${theme.layout.gridColumns}, 1fr)`,
            gap: theme.layout.gridGap,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded"
              style={{ backgroundColor: theme.colors.primary.light }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
