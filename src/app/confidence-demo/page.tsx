'use client';

import React from 'react';
import { CreationOrigin } from '@/types/origin-confidence';
import { ConfidenceIndicator } from '@/components/ui/confidence-indicator';
import { ExecutiveConfidenceDashboard } from '@/components/executive/executive-confidence-dashboard';
import {
  MobileConfidenceCard,
  MobileExecutiveSummary,
  MobileActionPanel,
} from '@/components/mobile/mobile-confidence-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Confidence Indicator Demonstration Page
 *
 * Showcases the complete Business Confidence Translation Layer
 * implementation for executive stakeholder validation.
 */
export default function ConfidenceDemoPage() {
  const demoItems = [
    {
      id: '1',
      title: 'AI-Generated Strategic Initiative for Field Service Optimization',
      type: 'idea' as const,
      aiConfidence: 0.85,
      qualityScore: 0.8,
      origin: CreationOrigin.AI,
      status: 'draft',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      title: 'Expert-Validated Solution for CAD Drawing Standards',
      type: 'solution' as const,
      aiConfidence: null,
      qualityScore: 0.95,
      origin: CreationOrigin.HUMAN,
      status: 'approved',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      id: '3',
      title: 'Hybrid Requirements for Client Communication Workflow',
      type: 'requirement' as const,
      aiConfidence: 0.75,
      qualityScore: 0.9,
      origin: CreationOrigin.HYBRID,
      status: 'in_review',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '4',
      title: 'Low-Confidence AI Suggestion for Budget Tracking',
      type: 'idea' as const,
      aiConfidence: 0.45,
      qualityScore: 0.3,
      origin: CreationOrigin.AI,
      status: 'draft',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: '5',
      title: 'AI-Generated FRD for Project Management Enhancement',
      type: 'frd' as const,
      aiConfidence: 0.9,
      qualityScore: 0.85,
      origin: CreationOrigin.AI,
      status: 'pending_review',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            FAEVision Confidence Indicators
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Executive-friendly business confidence translation system with
            AI/Human/Hybrid origin tracking and progressive disclosure for
            technical details.
          </p>
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700"
          >
            FAE-130: Business Confidence Translation Layer
          </Badge>
        </div>

        {/* Individual Indicators Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Confidence Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* High Confidence AI */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  High Confidence AI
                </h3>
                <ConfidenceIndicator
                  aiConfidence={0.9}
                  qualityScore={0.85}
                  origin={CreationOrigin.AI}
                  variant="detailed"
                />
              </div>

              {/* Human Expert */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Human Expert</h3>
                <ConfidenceIndicator
                  aiConfidence={null}
                  qualityScore={0.95}
                  origin={CreationOrigin.HUMAN}
                  variant="detailed"
                />
              </div>

              {/* Hybrid AI + Human */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Hybrid AI + Human
                </h3>
                <ConfidenceIndicator
                  aiConfidence={0.75}
                  qualityScore={0.9}
                  origin={CreationOrigin.HYBRID}
                  variant="detailed"
                />
              </div>

              {/* Low Confidence AI */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Low Confidence AI
                </h3>
                <ConfidenceIndicator
                  aiConfidence={0.4}
                  qualityScore={0.3}
                  origin={CreationOrigin.AI}
                  variant="detailed"
                />
              </div>

              {/* Medium Confidence */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Medium Confidence
                </h3>
                <ConfidenceIndicator
                  aiConfidence={0.6}
                  qualityScore={0.65}
                  origin={CreationOrigin.AI}
                  variant="detailed"
                />
              </div>

              {/* Compact Variant */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Compact View</h3>
                <ConfidenceIndicator
                  aiConfidence={0.8}
                  qualityScore={0.85}
                  origin={CreationOrigin.HYBRID}
                  variant="compact"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Confidence Dashboard</CardTitle>
            <p className="text-sm text-gray-600">
              F-pattern layout optimized for executive scanning behavior
            </p>
          </CardHeader>
          <CardContent>
            <ExecutiveConfidenceDashboard items={demoItems} />
          </CardContent>
        </Card>

        {/* Mobile Components */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Executive Summary</CardTitle>
              <p className="text-sm text-gray-600">
                Thumb-friendly interface for meeting scenarios
              </p>
            </CardHeader>
            <CardContent>
              <MobileExecutiveSummary items={demoItems} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mobile Action Panel</CardTitle>
              <p className="text-sm text-gray-600">
                Action-required items for executive attention
              </p>
            </CardHeader>
            <CardContent>
              <MobileActionPanel
                items={demoItems}
                onItemClick={id => console.log('Clicked item:', id)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Mobile Cards Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Confidence Cards</CardTitle>
            <p className="text-sm text-gray-600">
              44px touch targets with clear visual hierarchy
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {demoItems.slice(0, 4).map(item => (
                <MobileConfidenceCard
                  key={item.id}
                  title={item.title}
                  type={item.type}
                  aiConfidence={item.aiConfidence}
                  qualityScore={item.qualityScore}
                  origin={item.origin}
                  status={item.status}
                  createdAt={item.createdAt}
                  onClick={() => console.log('Clicked mobile card:', item.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Business Benefits
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    ✅ Clear visual distinction between AI, Human, and Hybrid
                    content
                  </li>
                  <li>✅ Executive-friendly risk level assessments</li>
                  <li>
                    ✅ Action-required indicators for decision prioritization
                  </li>
                  <li>✅ Progressive disclosure for technical users</li>
                  <li>✅ Mobile-optimized for executive meeting scenarios</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Technical Features
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ WCAG 2.1 AA accessibility compliance</li>
                  <li>✅ Traffic light system (Green/Yellow/Red)</li>
                  <li>✅ Responsive design with mobile-first approach</li>
                  <li>✅ TypeScript strict mode compatibility</li>
                  <li>✅ FAEVision design system integration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
