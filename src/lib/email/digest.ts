import { Resend } from 'resend';

/**
 * Executive Digest Email Service
 *
 * Handles sending weekly executive digest emails with:
 * - Top 5 hotspots summary
 * - Weekly performance metrics
 * - Key trends and action items
 * - Mobile-optimized HTML format
 *
 * Expert: Sarah Chen (Product Manager)
 * Integration: Resend email service (Vercel compatible)
 */

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ExecutiveUser {
  id: string;
  email: string;
  name: string;
  department?: string;
}

export interface DigestData {
  topHotspots: any[];
  weeklyMetrics: any;
  departmentBreakdown: any[];
  keyTrends: any[];
  generatedAt: string;
  period: {
    from: string;
    to: string;
  };
}

/**
 * Send weekly executive digest email
 */
export async function sendExecutiveDigest(
  executive: ExecutiveUser,
  digestData: DigestData
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️ RESEND_API_KEY not configured, skipping email');
    return;
  }

  const emailContent = generateDigestEmail(executive, digestData);

  try {
    const result = await resend.emails.send({
      from: 'FAEVision <digest@faevision.com>',
      to: [executive.email],
      subject: `FAEVision Weekly Digest - ${formatDate(new Date())}`,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log(`    📧 Email sent to ${executive.email}: ${result.data?.id}`);
    return result;
  } catch (error) {
    console.error(`    ❌ Failed to send email to ${executive.email}:`, error);
    throw error;
  }
}

/**
 * Generate HTML and text content for digest email
 */
function generateDigestEmail(executive: ExecutiveUser, digestData: DigestData) {
  const html = generateHTMLDigest(executive, digestData);
  const text = generateTextDigest(executive, digestData);

  return { html, text };
}

/**
 * Generate mobile-optimized HTML digest
 */
function generateHTMLDigest(
  executive: ExecutiveUser,
  digestData: DigestData
): string {
  const period = formatDateRange(digestData.period.from, digestData.period.to);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAEVision Weekly Digest</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container { 
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 { 
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .header p { 
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content { 
            padding: 24px;
        }
        .greeting { 
            font-size: 18px;
            margin-bottom: 24px;
            color: #1f2937;
        }
        .section { 
            margin-bottom: 32px;
        }
        .section h2 { 
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 16px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        .hotspot-card { 
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            background: #fafafa;
        }
        .hotspot-title { 
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .hotspot-meta { 
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .hotspot-summary { 
            font-size: 14px;
            color: #374151;
        }
        .metrics-grid { 
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }
        .metric-card { 
            text-align: center;
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #fafafa;
        }
        .metric-value { 
            font-size: 28px;
            font-weight: 700;
            color: #3b82f6;
            display: block;
        }
        .metric-label { 
            font-size: 14px;
            color: #6b7280;
            margin-top: 4px;
        }
        .trend-item { 
            padding: 12px;
            border-left: 4px solid #3b82f6;
            background: #eff6ff;
            margin-bottom: 8px;
            border-radius: 0 4px 4px 0;
        }
        .trend-title { 
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 4px;
        }
        .trend-description { 
            font-size: 14px;
            color: #374151;
        }
        .footer { 
            background: #f3f4f6;
            padding: 24px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .cta-button { 
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 16px;
        }
        @media (max-width: 600px) {
            .container { 
                margin: 0;
                border-radius: 0;
            }
            .metrics-grid { 
                grid-template-columns: 1fr;
                gap: 12px;
            }
            .content { 
                padding: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>FAEVision Weekly Digest</h1>
            <p>${period}</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Good morning ${executive.name || 'Executive'},
            </div>

            <!-- Top Hotspots Section -->
            <div class="section">
                <h2>🔥 Top Priority Hotspots</h2>
                ${generateHotspotsHTML(digestData.topHotspots)}
            </div>

            <!-- Weekly Metrics Section -->
            <div class="section">
                <h2>📊 Weekly Performance</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <span class="metric-value">${digestData.weeklyMetrics.newSignals}</span>
                        <div class="metric-label">New Signals</div>
                    </div>
                    <div class="metric-card">
                        <span class="metric-value">${digestData.weeklyMetrics.completedSolutions}</span>
                        <div class="metric-label">Solutions Completed</div>
                    </div>
                </div>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <span class="metric-value">${Math.round(digestData.weeklyMetrics.processingRate)}%</span>
                        <div class="metric-label">Processing Rate</div>
                    </div>
                    <div class="metric-card">
                        <span class="metric-value">${Math.round(digestData.weeklyMetrics.completionRate)}%</span>
                        <div class="metric-label">Completion Rate</div>
                    </div>
                </div>
            </div>

            <!-- Key Trends Section -->
            ${
              digestData.keyTrends.length > 0
                ? `
            <div class="section">
                <h2>📈 Key Trends</h2>
                ${digestData.keyTrends
                  .map(
                    trend => `
                    <div class="trend-item">
                        <div class="trend-title">${trend.title}</div>
                        <div class="trend-description">${trend.description}</div>
                    </div>
                `
                  )
                  .join('')}
            </div>
            `
                : ''
            }

            <!-- Department Breakdown -->
            ${
              digestData.departmentBreakdown.length > 0
                ? `
            <div class="section">
                <h2>🏗️ Department Activity</h2>
                ${digestData.departmentBreakdown
                  .map(
                    dept => `
                    <div class="hotspot-meta">
                        <strong>${dept.department}:</strong> ${dept.signalCount} signals
                    </div>
                `
                  )
                  .join('')}
            </div>
            `
                : ''
            }

            <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || 'https://faevision.com'}/hotspots" class="cta-button">
                    View Full Dashboard
                </a>
            </div>
        </div>

        <div class="footer">
            <p>This digest was generated automatically by FAEVision AI.</p>
            <p>Need help? Contact your system administrator.</p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate hotspots HTML section
 */
function generateHotspotsHTML(hotspots: any[]): string {
  if (hotspots.length === 0) {
    return '<p>No active hotspots requiring attention.</p>';
  }

  return hotspots
    .map(
      hotspot => `
    <div class="hotspot-card">
        <div class="hotspot-title">${hotspot.title}</div>
        <div class="hotspot-meta">
            Confidence: ${Math.round((hotspot.confidence || 0) * 100)}% • 
            Signals: ${hotspot.signals?.length || 0} • 
            Status: ${hotspot.status}
        </div>
        <div class="hotspot-summary">${hotspot.summary}</div>
    </div>
  `
    )
    .join('');
}

/**
 * Generate plain text digest for email clients that don't support HTML
 */
function generateTextDigest(
  executive: ExecutiveUser,
  digestData: DigestData
): string {
  const period = formatDateRange(digestData.period.from, digestData.period.to);

  let text = `FAEVision Weekly Digest - ${period}\n\n`;
  text += `Good morning ${executive.name || 'Executive'},\n\n`;

  // Top Hotspots
  text += `TOP PRIORITY HOTSPOTS:\n`;
  text += `========================\n`;
  if (digestData.topHotspots.length === 0) {
    text += `No active hotspots requiring attention.\n\n`;
  } else {
    digestData.topHotspots.forEach((hotspot, index) => {
      text += `${index + 1}. ${hotspot.title}\n`;
      text += `   Confidence: ${Math.round((hotspot.confidence || 0) * 100)}% | `;
      text += `Signals: ${hotspot.signals?.length || 0} | Status: ${hotspot.status}\n`;
      text += `   ${hotspot.summary}\n\n`;
    });
  }

  // Weekly Metrics
  text += `WEEKLY PERFORMANCE:\n`;
  text += `==================\n`;
  text += `• New Signals: ${digestData.weeklyMetrics.newSignals}\n`;
  text += `• Solutions Completed: ${digestData.weeklyMetrics.completedSolutions}\n`;
  text += `• Processing Rate: ${Math.round(digestData.weeklyMetrics.processingRate)}%\n`;
  text += `• Completion Rate: ${Math.round(digestData.weeklyMetrics.completionRate)}%\n\n`;

  // Key Trends
  if (digestData.keyTrends.length > 0) {
    text += `KEY TRENDS:\n`;
    text += `===========\n`;
    digestData.keyTrends.forEach(trend => {
      text += `• ${trend.title}: ${trend.description}\n`;
    });
    text += `\n`;
  }

  // Department Breakdown
  if (digestData.departmentBreakdown.length > 0) {
    text += `DEPARTMENT ACTIVITY:\n`;
    text += `===================\n`;
    digestData.departmentBreakdown.forEach(dept => {
      text += `• ${dept.department}: ${dept.signalCount} signals\n`;
    });
    text += `\n`;
  }

  text += `View full dashboard: ${process.env.NEXTAUTH_URL || 'https://faevision.com'}/hotspots\n\n`;
  text += `This digest was generated automatically by FAEVision AI.\n`;
  text += `Need help? Contact your system administrator.`;

  return text;
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date range for display
 */
function formatDateRange(from: string, to: string): string {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  const fromFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(fromDate);

  const toFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(toDate);

  return `${fromFormatted} - ${toFormatted}`;
}
