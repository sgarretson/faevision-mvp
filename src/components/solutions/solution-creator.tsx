'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Users,
  Calendar,
  DollarSign,
  Target,
  X,
  Save,
} from 'lucide-react';

/**
 * Solution Creator Component
 *
 * Executive-focused solution creation from hotspots:
 * - One-click solution promotion from hotspots
 * - Executive-friendly form design
 * - Business impact focus (ROI, timeline, resources)
 * - Mobile-optimized input experience
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Support: Alex Thompson (Lead Developer)
 */

interface SolutionCreatorProps {
  hotspot?: {
    id: string;
    title: string;
    summary: string;
    signalCount: number;
    linkedEntities: any[];
  };
  onSave: (solution: any) => Promise<void>;
  onCancel: () => void;
  open: boolean;
}

export function SolutionCreator({
  hotspot,
  onSave,
  onCancel,
  open,
}: SolutionCreatorProps) {
  const [solution, setSolution] = useState({
    title: hotspot ? `Solution: ${hotspot.title}` : '',
    description: '',
    estimatedEffort: '',
    businessValue: '',
    targetDate: '',
    successMetrics: '',
    stakeholders: '',
    budget: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!solution.title.trim()) {
      newErrors.title = 'Solution title is required';
    }

    if (!solution.description.trim()) {
      newErrors.description = 'Solution description is required';
    }

    if (!solution.businessValue.trim()) {
      newErrors.businessValue = 'Business value is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await onSave({
        ...solution,
        hotspotId: hotspot?.id,
        status: 'DRAFT',
        expectedImpactJson: {
          estimatedEffort: solution.estimatedEffort,
          businessValue: solution.businessValue,
          budget: solution.budget,
          successMetrics: solution.successMetrics
            .split('\n')
            .filter(m => m.trim()),
        },
      });
    } catch (error) {
      console.error('Error saving solution:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Solution
            </h2>
            {hotspot && (
              <p className="mt-1 text-sm text-gray-500">
                From hotspot: {hotspot.signalCount} signals
              </p>
            )}
          </div>

          <button
            onClick={onCancel}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hotspot Context */}
        {hotspot && (
          <div className="border-b border-gray-200 bg-blue-50 p-6">
            <h3 className="mb-2 text-sm font-medium text-blue-900">
              Hotspot Context
            </h3>
            <p className="text-sm text-blue-700">{hotspot.summary}</p>

            {hotspot.linkedEntities.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {hotspot.linkedEntities.slice(0, 5).map((entity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                    >
                      {entity.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6 p-6">
          {/* Solution Title */}
          <FormField label="Solution Title" required error={errors.title}>
            <input
              type="text"
              value={solution.title}
              onChange={e =>
                setSolution(prev => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Clear, actionable solution title"
            />
          </FormField>

          {/* Solution Description */}
          <FormField
            label="Solution Description"
            required
            error={errors.description}
          >
            <textarea
              value={solution.description}
              onChange={e =>
                setSolution(prev => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the proposed solution and implementation approach"
            />
          </FormField>

          {/* Business Impact Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Business Value"
              required
              error={errors.businessValue}
              icon={<DollarSign className="h-4 w-4" />}
            >
              <textarea
                value={solution.businessValue}
                onChange={e =>
                  setSolution(prev => ({
                    ...prev,
                    businessValue: e.target.value,
                  }))
                }
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Expected cost savings, revenue impact, or other business benefits"
              />
            </FormField>

            <FormField
              label="Estimated Effort"
              icon={<Users className="h-4 w-4" />}
            >
              <input
                type="text"
                value={solution.estimatedEffort}
                onChange={e =>
                  setSolution(prev => ({
                    ...prev,
                    estimatedEffort: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2 weeks, 40 hours, 3 team members"
              />
            </FormField>
          </div>

          {/* Timeline and Priority Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Target Completion"
              icon={<Calendar className="h-4 w-4" />}
            >
              <input
                type="date"
                value={solution.targetDate}
                onChange={e =>
                  setSolution(prev => ({ ...prev, targetDate: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField
              label="Priority Level"
              icon={<Target className="h-4 w-4" />}
            >
              <select
                value={solution.priority}
                onChange={e =>
                  setSolution(prev => ({
                    ...prev,
                    priority: e.target.value as any,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical Priority</option>
              </select>
            </FormField>
          </div>

          {/* Success Metrics */}
          <FormField
            label="Success Metrics"
            icon={<Target className="h-4 w-4" />}
          >
            <textarea
              value={solution.successMetrics}
              onChange={e =>
                setSolution(prev => ({
                  ...prev,
                  successMetrics: e.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="How will you measure success? One metric per line."
            />
          </FormField>

          {/* Stakeholders and Budget */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Key Stakeholders"
              icon={<Users className="h-4 w-4" />}
            >
              <input
                type="text"
                value={solution.stakeholders}
                onChange={e =>
                  setSolution(prev => ({
                    ...prev,
                    stakeholders: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Who needs to be involved?"
              />
            </FormField>

            <FormField
              label="Estimated Budget"
              icon={<DollarSign className="h-4 w-4" />}
            >
              <input
                type="text"
                value={solution.budget}
                onChange={e =>
                  setSolution(prev => ({ ...prev, budget: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="$0 - $50,000"
              />
            </FormField>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 bg-gray-50 p-6">
          <button
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              saving
                ? 'cursor-not-allowed bg-gray-400 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } `}
          >
            {saving ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Create Solution
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable form field component
 */
function FormField({
  label,
  required,
  error,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
        {icon && <span className="mr-2 text-gray-400">{icon}</span>}
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
