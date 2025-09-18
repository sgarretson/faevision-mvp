/**
 * A&E Domain Classification Engine Tests - FAE-133
 * Expert: Dr. Rachel Kim (AI Tagging Specialist)
 * Domain Validation: Marcus Rodriguez (Strategic Consultant)
 *
 * Comprehensive test suite for A&E domain classification accuracy
 * Target: 70%+ accuracy on construction industry inputs
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { AEDomainClassificationEngine } from '@/lib/ai/domain-classification-engine';
import type { DomainClassificationRequest } from '@/lib/ai/domain-classification-engine';

describe('A&E Domain Classification Engine', () => {
  let engine: AEDomainClassificationEngine;

  beforeEach(() => {
    engine = new AEDomainClassificationEngine();
  });

  /**
   * A&E Domain Test Cases
   * Curated by Marcus Rodriguez (Strategic Consultant)
   * Based on real A&E firm operational scenarios
   */
  const AE_TEST_CASES = [
    // PROCESS Root Cause Test Cases
    {
      input: {
        inputId: 'test-process-1',
        title: 'Approval Delays in Design Review',
        description:
          'Client approval process for schematic design is taking longer than expected. The review cycle has extended our timeline by 2 weeks. Need to streamline the approval workflow for future phases.',
        metadata: { department: 'Architectural', severity: 'MEDIUM' },
      },
      expected: {
        rootCause: 'PROCESS',
        minConfidence: 0.7,
        businessContext: {
          projectPhase: 'DESIGN',
          departmentPriority: 'ARCHITECTURAL',
          urgencyLevel: 'MEDIUM',
        },
      },
    },
    {
      input: {
        inputId: 'test-process-2',
        title: 'Coordination Issues with MEP Trades',
        description:
          'HVAC and electrical coordination meetings are not well organized. Multiple conflicts in ceiling space need resolution. Workflow for trade coordination needs improvement.',
        metadata: { department: 'MEP', severity: 'HIGH' },
      },
      expected: {
        rootCause: 'PROCESS',
        minConfidence: 0.6,
        businessContext: {
          departmentPriority: 'MEP',
          urgencyLevel: 'HIGH',
        },
      },
    },

    // RESOURCE Root Cause Test Cases
    {
      input: {
        inputId: 'test-resource-1',
        title: 'Structural Engineering Staff Shortage',
        description:
          'Current project load exceeds our structural engineering capacity. Need additional senior structural engineers to meet project deadlines. Consider hiring consultants or additional staff.',
        metadata: { department: 'Structural', severity: 'HIGH' },
      },
      expected: {
        rootCause: 'RESOURCE',
        minConfidence: 0.7,
        businessContext: {
          departmentPriority: 'STRUCTURAL',
          urgencyLevel: 'HIGH',
        },
      },
    },
    {
      input: {
        inputId: 'test-resource-2',
        title: 'CAD Workstation Equipment Failure',
        description:
          'Two CAD workstations crashed this week affecting productivity. Hardware is aging and needs replacement. Budget allocation required for new equipment procurement.',
        metadata: { department: 'Architectural', severity: 'MEDIUM' },
      },
      expected: {
        rootCause: 'RESOURCE',
        minConfidence: 0.6,
        businessContext: {
          departmentPriority: 'ARCHITECTURAL',
          urgencyLevel: 'MEDIUM',
        },
      },
    },

    // COMMUNICATION Root Cause Test Cases
    {
      input: {
        inputId: 'test-communication-1',
        title: 'Client Requirements Not Clear',
        description:
          'Client expectations for building performance are unclear. Multiple stakeholders have different interpretations of project requirements. Need clarification meeting with owner and end users.',
        metadata: { department: 'Project Management', severity: 'HIGH' },
      },
      expected: {
        rootCause: 'COMMUNICATION',
        minConfidence: 0.7,
        businessContext: {
          departmentPriority: 'PROJECT_MGMT',
          urgencyLevel: 'HIGH',
        },
      },
    },
    {
      input: {
        inputId: 'test-communication-2',
        title: 'Poor Documentation from Subcontractor',
        description:
          'Mechanical contractor provided incomplete shop drawings. Documentation lacks detail required for coordination review. Need better communication of drawing standards.',
        metadata: { department: 'MEP', severity: 'MEDIUM' },
      },
      expected: {
        rootCause: 'COMMUNICATION',
        minConfidence: 0.6,
        businessContext: {
          departmentPriority: 'MEP',
        },
      },
    },

    // TECHNOLOGY Root Cause Test Cases
    {
      input: {
        inputId: 'test-technology-1',
        title: 'Revit Software Licensing Issues',
        description:
          'Revit licenses are not available for new team members. Software licensing server is having connectivity issues. IT support needed for license management system.',
        metadata: { department: 'IT', severity: 'HIGH' },
      },
      expected: {
        rootCause: 'TECHNOLOGY',
        minConfidence: 0.8,
        businessContext: {
          urgencyLevel: 'HIGH',
        },
      },
    },
    {
      input: {
        inputId: 'test-technology-2',
        title: 'BIM Model File Corruption',
        description:
          'Central BIM model file corrupted during synchronization. Multiple team members lost work. Need better file backup and version control system for large BIM projects.',
        metadata: { department: 'Architectural', severity: 'CRITICAL' },
      },
      expected: {
        rootCause: 'TECHNOLOGY',
        minConfidence: 0.7,
        businessContext: {
          urgencyLevel: 'CRITICAL',
        },
      },
    },

    // TRAINING Root Cause Test Cases
    {
      input: {
        inputId: 'test-training-1',
        title: 'New Hire Unfamiliar with Building Codes',
        description:
          'Junior architect needs training on local building codes and zoning requirements. Lack of code knowledge is slowing project progress. Mentoring and training program needed.',
        metadata: { department: 'Architectural', severity: 'MEDIUM' },
      },
      expected: {
        rootCause: 'TRAINING',
        minConfidence: 0.7,
        businessContext: {
          departmentPriority: 'ARCHITECTURAL',
        },
      },
    },
    {
      input: {
        inputId: 'test-training-2',
        title: 'Team Needs Energy Modeling Training',
        description:
          'Energy modeling software is new to the team. Staff unfamiliar with advanced energy analysis tools. Training required to meet green building certification requirements.',
        metadata: { department: 'MEP', severity: 'MEDIUM' },
      },
      expected: {
        rootCause: 'TRAINING',
        minConfidence: 0.6,
        businessContext: {
          departmentPriority: 'MEP',
        },
      },
    },

    // QUALITY Root Cause Test Cases
    {
      input: {
        inputId: 'test-quality-1',
        title: 'Building Code Compliance Issues',
        description:
          'Plan review comments indicate building code violations in egress design. Rework required for stair and corridor dimensions. QC process needs improvement for code compliance.',
        metadata: { department: 'Architectural', severity: 'HIGH' },
      },
      expected: {
        rootCause: 'QUALITY',
        minConfidence: 0.8,
        businessContext: {
          departmentPriority: 'ARCHITECTURAL',
          urgencyLevel: 'HIGH',
        },
      },
    },
    {
      input: {
        inputId: 'test-quality-2',
        title: 'Structural Calculation Errors Found',
        description:
          'Third-party review found errors in beam sizing calculations. Rework required for structural drawings. Need additional QA review process for structural calculations.',
        metadata: { department: 'Structural', severity: 'CRITICAL' },
      },
      expected: {
        rootCause: 'QUALITY',
        minConfidence: 0.7,
        businessContext: {
          departmentPriority: 'STRUCTURAL',
          urgencyLevel: 'CRITICAL',
        },
      },
    },

    // Edge Cases and Mixed Scenarios
    {
      input: {
        inputId: 'test-mixed-1',
        title: 'Complex Multi-Issue Scenario',
        description:
          'Project has staff shortage, software problems, and client communication issues. Multiple departments affected. Need comprehensive solution addressing staffing, technology, and client management.',
        metadata: { department: 'Project Management', severity: 'HIGH' },
      },
      expected: {
        rootCause: 'RESOURCE', // Should pick strongest signal (staff shortage)
        minConfidence: 0.5, // Lower confidence for mixed scenarios
        businessContext: {
          departmentPriority: 'PROJECT_MGMT',
          urgencyLevel: 'HIGH',
        },
      },
    },
    {
      input: {
        inputId: 'test-minimal-1',
        title: 'Minimal Information',
        description: 'Issue with project.',
        metadata: { severity: 'LOW' },
      },
      expected: {
        rootCause: 'PROCESS', // Default to most common
        minConfidence: 0.3, // Low confidence for minimal info
        businessContext: {
          urgencyLevel: 'LOW',
        },
      },
    },
  ];

  describe('Root Cause Classification Accuracy', () => {
    test.each(AE_TEST_CASES)(
      'should correctly classify $input.inputId as $expected.rootCause',
      async ({ input, expected }) => {
        const result = await engine.classifyInput(input);

        // Verify root cause classification
        expect(result.classification.rootCause).toBe(expected.rootCause);

        // Verify confidence meets minimum threshold
        expect(result.classification.confidence).toBeGreaterThanOrEqual(
          expected.minConfidence
        );

        // Verify business context extraction
        if (expected.businessContext.projectPhase) {
          expect(result.classification.businessContext.projectPhase).toBe(
            expected.businessContext.projectPhase
          );
        }

        if (expected.businessContext.departmentPriority) {
          expect(result.classification.businessContext.departmentPriority).toBe(
            expected.businessContext.departmentPriority
          );
        }

        if (expected.businessContext.urgencyLevel) {
          expect(result.classification.businessContext.urgencyLevel).toBe(
            expected.businessContext.urgencyLevel
          );
        }
      }
    );
  });

  describe('Performance Requirements', () => {
    test('should complete classification in under 500ms', async () => {
      const testInput = AE_TEST_CASES[0].input;
      const startTime = Date.now();

      const result = await engine.classifyInput(testInput);

      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(500);
      expect(result.processingTime).toBeLessThan(500);
    });

    test('should handle concurrent classifications efficiently', async () => {
      const testInputs = AE_TEST_CASES.slice(0, 5).map(tc => tc.input);
      const startTime = Date.now();

      const promises = testInputs.map(input => engine.classifyInput(input));
      const results = await Promise.all(promises);

      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(2000); // 5 classifications in under 2s
      expect(results).toHaveLength(5);

      // Each result should have reasonable processing time
      results.forEach(result => {
        expect(result.processingTime).toBeLessThan(500);
      });
    });
  });

  describe('Business Context Extraction', () => {
    test('should extract project phase correctly', async () => {
      const designInput: DomainClassificationRequest = {
        inputId: 'test-phase-design',
        title: 'Design Development Issues',
        description:
          'Problems with schematic design and design development phase coordination.',
      };

      const result = await engine.classifyInput(designInput);
      expect(result.classification.businessContext.projectPhase).toBe('DESIGN');
    });

    test('should extract department priority from metadata and content', async () => {
      const mepInput: DomainClassificationRequest = {
        inputId: 'test-dept-mep',
        title: 'HVAC System Sizing',
        description:
          'Mechanical system sizing issues with electrical coordination.',
        metadata: { department: 'MEP Engineering' },
      };

      const result = await engine.classifyInput(mepInput);
      expect(result.classification.businessContext.departmentPriority).toBe(
        'MEP'
      );
    });

    test('should determine urgency from severity and content', async () => {
      const urgentInput: DomainClassificationRequest = {
        inputId: 'test-urgent',
        title: 'Critical System Failure',
        description:
          'Urgent issue requiring immediate attention. Critical path affected.',
        metadata: { severity: 'CRITICAL' },
      };

      const result = await engine.classifyInput(urgentInput);
      expect(result.classification.businessContext.urgencyLevel).toBe(
        'CRITICAL'
      );
    });
  });

  describe('AI Enhancement Detection', () => {
    test('should flag complex cases for AI enhancement', async () => {
      const complexInput: DomainClassificationRequest = {
        inputId: 'test-complex',
        title: 'Ambiguous Multi-Departmental Issue',
        description:
          'Complex issue with unclear root cause affecting multiple departments.',
      };

      const result = await engine.classifyInput(complexInput);
      expect(result.aiEnhancementNeeded).toBe(true);
      expect(result.classification.confidence).toBeLessThan(0.6);
    });

    test('should not flag clear cases for AI enhancement', async () => {
      const clearInput: DomainClassificationRequest = {
        inputId: 'test-clear',
        title: 'Revit Software License Problem',
        description:
          'Revit software licensing server is down. IT support needed for license management.',
      };

      const result = await engine.classifyInput(clearInput);
      expect(result.aiEnhancementNeeded).toBe(false);
      expect(result.classification.confidence).toBeGreaterThanOrEqual(0.6);
    });
  });

  describe('Rule Matching and Diagnostics', () => {
    test('should provide rule match diagnostics', async () => {
      const testInput = AE_TEST_CASES[0].input;
      const result = await engine.classifyInput(testInput);

      expect(result.ruleMatches).toBeDefined();
      expect(result.ruleMatches.length).toBeGreaterThan(0);
      expect(result.diagnostics).toBeDefined();
      expect(result.diagnostics.totalKeywordsFound).toBeGreaterThan(0);
    });

    test('should include matched terms in rule results', async () => {
      const processInput: DomainClassificationRequest = {
        inputId: 'test-rule-match',
        title: 'Approval Workflow Delay',
        description:
          'Client approval process causing timeline delays in project milestone.',
      };

      const result = await engine.classifyInput(processInput);
      const processMatch = result.ruleMatches.find(
        match => match.rule === 'PROCESS'
      );

      expect(processMatch).toBeDefined();
      expect(processMatch!.matchedTerms.length).toBeGreaterThan(0);
      expect(processMatch!.matchedTerms).toEqual(
        expect.arrayContaining(['approval', 'process', 'timeline'])
      );
    });
  });

  describe('Overall Accuracy Assessment', () => {
    test('should achieve 70%+ classification accuracy on A&E test cases', async () => {
      let correctClassifications = 0;
      const results: Array<{ input: any; expected: any; actual: any }> = [];

      // Process all test cases
      for (const testCase of AE_TEST_CASES) {
        const result = await engine.classifyInput(testCase.input);

        const isCorrect =
          result.classification.rootCause === testCase.expected.rootCause &&
          result.classification.confidence >= testCase.expected.minConfidence;

        if (isCorrect) {
          correctClassifications++;
        }

        results.push({
          input: testCase.input.inputId,
          expected: testCase.expected.rootCause,
          actual: result.classification.rootCause,
        });
      }

      const accuracy = (correctClassifications / AE_TEST_CASES.length) * 100;

      console.log(
        `🎯 A&E Domain Classification Accuracy: ${accuracy.toFixed(1)}%`
      );
      console.log(
        `📊 Correct: ${correctClassifications}/${AE_TEST_CASES.length}`
      );

      // Log failed cases for analysis
      const failedCases = results.filter(
        (r, i) => r.actual !== AE_TEST_CASES[i].expected.rootCause
      );

      if (failedCases.length > 0) {
        console.log('❌ Failed Classifications:', failedCases);
      }

      // Verify 70%+ accuracy requirement
      expect(accuracy).toBeGreaterThanOrEqual(70);
    });
  });
});

/**
 * Integration Tests with Signal Domain Processor
 */
describe('Signal Domain Integration', () => {
  // TODO: Add integration tests when SignalDomainProcessor is implemented
  test.skip('should integrate with signal processing workflow', () => {
    // Placeholder for integration tests
  });
});
