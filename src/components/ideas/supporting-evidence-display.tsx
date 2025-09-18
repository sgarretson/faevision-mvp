/**
 * Supporting Evidence Display Component
 * Formats and displays the evidenceJson data in an executive-friendly format
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Clock,
  DollarSign,
} from 'lucide-react';

interface SupportingEvidenceProps {
  readonly evidenceJson: any;
  readonly className?: string;
}

export function SupportingEvidenceDisplay({
  evidenceJson,
  className,
}: SupportingEvidenceProps) {
  if (!evidenceJson) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Supporting Evidence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No supporting evidence available.</p>
        </CardContent>
      </Card>
    );
  }

  const {
    priority,
    sourceInputs = [],
    sourceInputCount = 0,
    affectedDepartments = [],
    relatedCategories = [],
    estimatedEffort,
    expectedOutcome,
    implementationApproach,
    successMetrics = [],
    riskConsiderations = [],
    keyStakeholders = [],
  } = evidenceJson;

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort?.toUpperCase()) {
      case 'VERY_HIGH':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Supporting Evidence</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Source Inputs Summary */}
          <div>
            <h4 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
              <Target className="mr-2 h-4 w-4" />
              Source Strategic Inputs ({sourceInputCount})
            </h4>
            <div className="space-y-2">
              {sourceInputs.map((input: any, idx: number) => (
                <div
                  key={input.id || idx}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {input.title}
                    </div>
                    {input.departmentName && (
                      <div className="text-sm text-gray-500">
                        Department: {input.departmentName}
                      </div>
                    )}
                  </div>
                  {input.severity && (
                    <Badge
                      variant="outline"
                      className={getPriorityColor(input.severity)}
                    >
                      {input.severity}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Overview */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                <TrendingUp className="mr-2 h-4 w-4" />
                Priority & Effort
              </h4>
              <div className="space-y-2">
                {priority && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Priority:</span>
                    <Badge className={getPriorityColor(priority)}>
                      {priority}
                    </Badge>
                  </div>
                )}
                {estimatedEffort && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Effort:</span>
                    <Badge className={getEffortColor(estimatedEffort)}>
                      {estimatedEffort.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                <Users className="mr-2 h-4 w-4" />
                Scope & Impact
              </h4>
              <div className="space-y-2">
                {affectedDepartments.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Departments:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {affectedDepartments.map((dept: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {relatedCategories.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Categories:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {relatedCategories.map((cat: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expected Outcome */}
          {expectedOutcome && (
            <div>
              <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                <CheckCircle className="mr-2 h-4 w-4" />
                Expected Outcome
              </h4>
              <p className="rounded-lg bg-green-50 p-3 text-sm text-gray-700">
                {expectedOutcome}
              </p>
            </div>
          )}

          {/* Implementation Approach */}
          {implementationApproach && (
            <div>
              <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                <Clock className="mr-2 h-4 w-4" />
                Implementation Approach
              </h4>
              <div className="rounded-lg bg-blue-50 p-3">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {implementationApproach}
                </pre>
              </div>
            </div>
          )}

          {/* Success Metrics */}
          {successMetrics.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                <TrendingUp className="mr-2 h-4 w-4" />
                Success Metrics
              </h4>
              <ul className="space-y-2">
                {successMetrics.map((metric: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-700">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Considerations */}
          {riskConsiderations.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Risk Considerations
              </h4>
              <ul className="space-y-2">
                {riskConsiderations.map((risk: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                    <span className="text-sm text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Stakeholders */}
          {keyStakeholders.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-900">
                <Users className="mr-2 h-4 w-4" />
                Key Stakeholders
              </h4>
              <div className="flex flex-wrap gap-2">
                {keyStakeholders.map((stakeholder: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-purple-50 text-purple-700"
                  >
                    {stakeholder}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
