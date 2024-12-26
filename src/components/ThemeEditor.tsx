import React, { useState, useEffect } from 'react';
import { themeService, Theme, CreateThemeData, ThemeColors, ThemeLayout } from '../services/themeService';
import { toast } from 'react-toastify';
import { ChromePicker, ColorResult } from 'react-color';
import MonacoEditor from '@monaco-editor/react';

interface ThemeEditorProps {
  userId: string;
  onThemeChange?: (theme: Theme) => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ userId, onThemeChange }) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingColor, setEditingColor] = useState<keyof ThemeColors | null>(null);
  const [showCSSEditor, setShowCSSEditor] = useState(false);

  useEffect(() => {
    loadThemes();
  }, [userId]);

  const loadThemes = async () => {
    try {
      const [themeList, active] = await Promise.all([
        themeService.getThemes(userId),
        themeService.getActiveTheme(userId),
      ]);
      setThemes(themeList);
      setActiveTheme(active);
    } catch (error) {
      toast.error('Failed to load themes');
      console.error(error);
    }
  };

  const handleCreateTheme = async () => {
    setLoading(true);
    try {
      const newTheme: CreateThemeData = {
        name: 'New Theme',
        colors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
          accent: '#10B981',
          background: '#FFFFFF',
          text: '#1F2937',
          heading: '#111827',
          link: '#2563EB',
        },
        layout: {
          type: 'modern',
          sidebar: 'left',
          headerStyle: 'fixed',
          contentWidth: 'contained',
          spacing: 'comfortable',
        },
      };

      const theme = await themeService.createTheme(userId, newTheme);
      setThemes([...themes, theme]);
      toast.success('New theme created');
    } catch (error) {
      toast.error('Failed to create theme');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = async (color: { hex: string }, field: keyof ThemeColors) => {
    if (!activeTheme) return;

    setLoading(true);
    try {
      const updatedTheme = await themeService.updateTheme(userId, activeTheme.id, {
        colors: {
          [field]: color.hex,
        },
      });
      setActiveTheme(updatedTheme);
      onThemeChange?.(updatedTheme);
      toast.success('Theme color updated');
    } catch (error) {
      toast.error('Failed to update theme color');
      console.error(error);
    } finally {
      setLoading(false);
      setEditingColor(null);
    }
  };

  const handleLayoutChange = async (field: keyof ThemeLayout, value: string) => {
    if (!activeTheme) return;

    setLoading(true);
    try {
      const updatedTheme = await themeService.updateTheme(userId, activeTheme.id, {
        layout: {
          [field]: value,
        },
      });
      setActiveTheme(updatedTheme);
      onThemeChange?.(updatedTheme);
      toast.success('Theme layout updated');
    } catch (error) {
      toast.error('Failed to update theme layout');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomCSSChange = async (css: string) => {
    if (!activeTheme) return;

    setLoading(true);
    try {
      const updatedTheme = await themeService.updateTheme(userId, activeTheme.id, {
        customCSS: {
          name: activeTheme.customCSS?.name || 'Custom CSS',
          css,
        },
      });
      setActiveTheme(updatedTheme);
      onThemeChange?.(updatedTheme);
      toast.success('Custom CSS updated');
    } catch (error) {
      toast.error('Failed to update custom CSS');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeActivation = async (themeId: string) => {
    setLoading(true);
    try {
      await themeService.setActiveTheme(userId, themeId);
      const updatedTheme = await themeService.getActiveTheme(userId);
      setActiveTheme(updatedTheme);
      onThemeChange?.(updatedTheme!);
      toast.success('Theme activated');
    } catch (error) {
      toast.error('Failed to activate theme');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!activeTheme) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No Active Theme</h3>
        <p className="mt-2 text-sm text-gray-500">Create a new theme to get started</p>
        <button
          onClick={handleCreateTheme}
          disabled={loading}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Theme
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Theme Editor</h2>
        <div className="space-x-4">
          <select
            value={activeTheme.id}
            onChange={(e) => handleThemeActivation(e.target.value)}
            disabled={loading}
            className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            aria-label="Select theme"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleCreateTheme}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Theme
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
          <div className="space-y-4">
            {Object.entries(activeTheme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setEditingColor(editingColor === key ? null : key as keyof ThemeColors)}
                    className="w-10 h-10 rounded-md border border-gray-300"
                    style={{ backgroundColor: value }}
                    title={`Change ${key} color`}
                    aria-label={`Change ${key} color`}
                  />
                  {editingColor === key && (
                    <div className="absolute right-0 top-12 z-10">
                      <ChromePicker
                        color={value}
                        onChange={(color: ColorResult) => handleColorChange(color, key as keyof ThemeColors)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
          <div className="space-y-4">
            {Object.entries(activeTheme.layout).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <select
                  value={value}
                  onChange={(e) => handleLayoutChange(key as keyof ThemeLayout, e.target.value)}
                  disabled={loading}
                  className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  aria-label={`Select ${key} layout`}
                >
                  {key === 'type' && (
                    <>
                      <option value="classic">Classic</option>
                      <option value="modern">Modern</option>
                      <option value="minimal">Minimal</option>
                      <option value="custom">Custom</option>
                    </>
                  )}
                  {key === 'sidebar' && (
                    <>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="none">None</option>
                    </>
                  )}
                  {key === 'headerStyle' && (
                    <>
                      <option value="fixed">Fixed</option>
                      <option value="sticky">Sticky</option>
                      <option value="static">Static</option>
                    </>
                  )}
                  {key === 'contentWidth' && (
                    <>
                      <option value="full">Full</option>
                      <option value="contained">Contained</option>
                    </>
                  )}
                  {key === 'spacing' && (
                    <>
                      <option value="compact">Compact</option>
                      <option value="comfortable">Comfortable</option>
                      <option value="spacious">Spacious</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Custom CSS</h3>
          <button
            onClick={() => setShowCSSEditor(!showCSSEditor)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showCSSEditor ? 'Hide Editor' : 'Show Editor'}
          </button>
        </div>
        {showCSSEditor && (
          <div className="border border-gray-300 rounded-md">
            <MonacoEditor
              height="400px"
              language="css"
              theme="vs-light"
              value={activeTheme.customCSS?.css || ''}
              onChange={(value: string | undefined) => handleCustomCSSChange(value || '')}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}; 