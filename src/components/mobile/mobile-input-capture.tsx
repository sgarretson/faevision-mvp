'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Mic,
  MicOff,
  Camera,
  Image as ImageIcon,
  MapPin,
  Clock,
  AlertTriangle,
  AlertCircle,
  Send,
  X,
  Plus,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Sprint 3 Story 4: Mobile Input Capture
 * Expert Lead: Maya Rodriguez (UX Expert) + David Chen (Visual Designer)
 *
 * Meeting-friendly mobile input capture with voice recording, photo capture,
 * and rapid categorization for executives on-the-go
 */

interface MobileInputCaptureProps {
  isModal?: boolean;
  onClose?: () => void;
  onSubmit?: (input: any) => void;
  prefilledData?: {
    title?: string;
    description?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    department?: string;
  };
}

const severityOptions = [
  {
    value: 'LOW',
    label: 'Low',
    color: 'bg-green-100 text-green-800',
    icon: '🟢',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🟡',
  },
  {
    value: 'HIGH',
    label: 'High',
    color: 'bg-orange-100 text-orange-800',
    icon: '🟠',
  },
  {
    value: 'CRITICAL',
    label: 'Critical',
    color: 'bg-red-100 text-red-800',
    icon: '🔴',
  },
];

const departmentOptions = [
  'Architecture',
  'Structural Engineering',
  'MEP Engineering',
  'Project Management',
  'Field Operations',
  'Quality Control',
  'Client Relations',
  'Administration',
];

const quickTemplates = [
  {
    title: 'Field Issue',
    description: 'Issue identified during field inspection',
    severity: 'HIGH' as const,
    department: 'Field Operations',
    icon: '🏗️',
  },
  {
    title: 'Client Concern',
    description: 'Client has raised a concern requiring attention',
    severity: 'MEDIUM' as const,
    department: 'Client Relations',
    icon: '👥',
  },
  {
    title: 'Quality Issue',
    description: 'Quality control issue requiring immediate review',
    severity: 'HIGH' as const,
    department: 'Quality Control',
    icon: '🔍',
  },
  {
    title: 'Design Coordination',
    description: 'Design coordination issue between disciplines',
    severity: 'MEDIUM' as const,
    department: 'Architecture',
    icon: '📐',
  },
];

export function MobileInputCapture({
  isModal = false,
  onClose,
  onSubmit,
  prefilledData,
}: MobileInputCaptureProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState(prefilledData?.title || '');
  const [description, setDescription] = useState(
    prefilledData?.description || ''
  );
  const [severity, setSeverity] = useState<
    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  >(prefilledData?.severity || 'MEDIUM');
  const [department, setDepartment] = useState(prefilledData?.department || '');
  const [location, setLocation] = useState('');

  // Capture state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<'form' | 'voice' | 'template'>(
    'form'
  );
  const [showSeverityPicker, setShowSeverityPicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        // In production, this would be sent for transcription
        console.log('Audio recorded:', audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const applyTemplate = (template: (typeof quickTemplates)[0]) => {
    setTitle(template.title);
    setDescription(template.description);
    setSeverity(template.severity);
    setDepartment(template.department);
    setActiveTab('form');
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation(
            `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          );
        },
        error => {
          console.error('Location error:', error);
          setLocation('Location unavailable');
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please provide both title and description');
      return;
    }

    setIsSubmitting(true);

    try {
      const inputData = {
        title: title.trim(),
        description: description.trim(),
        severity,
        department: department || 'General',
        location: location || undefined,
        photos: photos.length > 0 ? photos : undefined,
        capturedAt: new Date().toISOString(),
        captureMethod: 'mobile',
      };

      if (onSubmit) {
        onSubmit(inputData);
      } else {
        // Submit to API
        const response = await fetch('/api/inputs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputData),
        });

        if (response.ok) {
          if (isModal && onClose) {
            onClose();
          } else {
            router.push('/inputs');
          }
        } else {
          throw new Error('Failed to submit input');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit input. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('bg-white', isModal ? 'rounded-t-lg' : 'min-h-screen')}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Capture Input</h2>
          <div className="flex items-center space-x-2">
            {isModal && (
              <button
                onClick={onClose}
                className="touch-manipulation rounded-lg p-2 text-gray-400 hover:text-gray-600"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-3 flex rounded-lg bg-gray-100 p-1">
          {[
            { key: 'form', label: 'Form', icon: '📝' },
            { key: 'voice', label: 'Voice', icon: '🎤' },
            { key: 'template', label: 'Templates', icon: '⚡' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'flex-1 touch-manipulation rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              style={{ minHeight: '44px' }}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-4">
        {activeTab === 'template' && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">
              Quick Templates
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {quickTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => applyTemplate(template)}
                  className="flex touch-manipulation items-center rounded-lg border border-gray-200 bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
                  style={{ minHeight: '44px' }}
                >
                  <div className="mr-3 text-2xl">{template.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {template.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {template.description}
                    </div>
                    <div className="mt-1 flex items-center space-x-2">
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs',
                          severityOptions.find(
                            s => s.value === template.severity
                          )?.color
                        )}
                      >
                        {template.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {template.department}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-6">
                <div
                  className={cn(
                    'mx-auto flex h-24 w-24 items-center justify-center rounded-full transition-colors',
                    isRecording
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  )}
                >
                  {isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </div>
              </div>

              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {isRecording ? 'Recording...' : 'Voice Capture'}
              </h3>

              {isRecording && (
                <div className="mb-4 font-mono text-2xl text-red-600">
                  {formatDuration(recordingDuration)}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    'w-full touch-manipulation rounded-lg px-6 py-4 font-medium transition-colors',
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                  style={{ minHeight: '44px' }}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 inline h-5 w-5" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 inline h-5 w-5" />
                      Start Recording
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600">
                  {isRecording
                    ? 'Speak clearly about the issue you want to capture'
                    : 'Tap to start recording your voice input'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Brief description of the issue"
                className="w-full touch-manipulation rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                style={{ minHeight: '44px' }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detailed description of the issue, impact, and any immediate actions needed"
                rows={4}
                className="w-full touch-manipulation resize-none rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Severity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Severity
              </label>
              <div className="grid grid-cols-2 gap-2">
                {severityOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSeverity(option.value as any)}
                    className={cn(
                      'flex touch-manipulation items-center justify-center rounded-lg border-2 px-4 py-3 font-medium transition-colors',
                      severity === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    )}
                    style={{ minHeight: '44px' }}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full touch-manipulation rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                style={{ minHeight: '44px' }}
              >
                <option value="">Select Department</option>
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Project location, building, floor, etc."
                  className="flex-1 touch-manipulation rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  style={{ minHeight: '44px' }}
                />
                <button
                  onClick={getCurrentLocation}
                  className="touch-manipulation rounded-lg bg-gray-100 px-4 py-3 text-gray-600 hover:bg-gray-200"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Photo Capture */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Photos
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex touch-manipulation items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-gray-600 hover:border-gray-400 hover:text-gray-700"
                  style={{ minHeight: '44px' }}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo
                </button>

                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.capture = '';
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex touch-manipulation items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-gray-600 hover:border-gray-400 hover:text-gray-700"
                  style={{ minHeight: '44px' }}
                >
                  <ImageIcon className="mr-2 h-5 w-5" />
                  From Gallery
                </button>
              </div>

              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(photo)}
                        alt={`Captured photo ${index + 1} for strategic input`}
                        width={80}
                        height={80}
                        className="h-20 w-full rounded-lg object-cover"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="w-full touch-manipulation py-4 text-base font-medium"
          style={{ minHeight: '44px' }}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Input
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
