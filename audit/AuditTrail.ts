// Audit Trail System for Regulatory Compliance
// This system logs all AI decisions for regulatory compliance

interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  requestData: any;
  responseData: any;
  confidenceScore: number;
  ipAddress?: string;
  userAgent?: string;
}

class AuditTrail {
  private auditLog: AuditEntry[] = [];
  private maxLogSize: number = 10000; // Maximum number of entries to keep in memory

  // Log an AI analysis decision
  logAnalysisDecision(
    userId: string,
    action: string,
    resource: string,
    requestData: any,
    responseData: any,
    confidenceScore: number,
    ipAddress?: string,
    userAgent?: string
  ): string {
    const entry: AuditEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      userId,
      action,
      resource,
      requestData,
      responseData,
      confidenceScore,
      ipAddress,
      userAgent
    };

    // Add to audit log
    this.auditLog.push(entry);

    // Trim log if it exceeds maximum size
    if (this.auditLog.length > this.maxLogSize) {
      this.auditLog = this.auditLog.slice(-this.maxLogSize);
    }

    // In a real implementation, we would also:
    // 1. Save to a database
    // 2. Send to a logging service
    // 3. Encrypt sensitive data
    // 4. Comply with HIPAA/GDPR regulations

    console.log(`Audit entry created: ${entry.id} - ${action} on ${resource} by user ${userId}`);
    
    return entry.id;
  }

  // Retrieve audit entries
  getAuditEntries(filter?: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    action?: string;
    minConfidence?: number;
  }): AuditEntry[] {
    let filteredEntries = [...this.auditLog];

    if (filter) {
      if (filter.userId) {
        filteredEntries = filteredEntries.filter(entry => entry.userId === filter.userId);
      }
      
      if (filter.startDate) {
        filteredEntries = filteredEntries.filter(entry => entry.timestamp >= filter.startDate!);
      }
      
      if (filter.endDate) {
        filteredEntries = filteredEntries.filter(entry => entry.timestamp <= filter.endDate!);
      }
      
      if (filter.action) {
        filteredEntries = filteredEntries.filter(entry => entry.action === filter.action);
      }
      
      if (filter.minConfidence !== undefined) {
        filteredEntries = filteredEntries.filter(entry => entry.confidenceScore >= filter.minConfidence);
      }
    }

    // Sort by timestamp, newest first
    return filteredEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Export audit trail to JSON
  exportToJson(): string {
    return JSON.stringify(this.auditLog, null, 2);
  }

  // Export audit trail to CSV
  exportToCsv(): string {
    if (this.auditLog.length === 0) {
      return "No audit entries to export";
    }

    // CSV header
    let csv = "ID,Timestamp,User ID,Action,Resource,Confidence Score,IP Address,User Agent\n";

    // CSV rows
    for (const entry of this.auditLog) {
      csv += `"${entry.id}",`;
      csv += `"${entry.timestamp.toISOString()}",`;
      csv += `"${entry.userId}",`;
      csv += `"${entry.action}",`;
      csv += `"${entry.resource}",`;
      csv += `"${entry.confidenceScore}",`;
      csv += `"${entry.ipAddress || ''}",`;
      csv += `"${entry.userAgent || ''}"\n`;
    }

    return csv;
  }

  // Generate compliance report
  generateComplianceReport(): string {
    const totalEntries = this.auditLog.length;
    const uniqueUsers = new Set(this.auditLog.map(entry => entry.userId)).size;
    const actions = [...new Set(this.auditLog.map(entry => entry.action))];
    const avgConfidence = this.auditLog.reduce((sum, entry) => sum + entry.confidenceScore, 0) / totalEntries;

    let report = `
Audit Trail Compliance Report
=============================
Generated on: ${new Date().toISOString()}

Summary:
- Total Audit Entries: ${totalEntries}
- Unique Users: ${uniqueUsers}
- Actions Logged: ${actions.join(', ')}
- Average Confidence Score: ${avgConfidence.toFixed(2)}%

Entries by Action:
`;

    // Count entries by action
    const actionCounts: Record<string, number> = {};
    for (const entry of this.auditLog) {
      actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1;
    }

    for (const [action, count] of Object.entries(actionCounts)) {
      report += `- ${action}: ${count} entries\n`;
    }

    return report;
  }

  // Generate a unique ID for audit entries
  private generateId(): string {
    return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Create a singleton instance
const auditTrail = new AuditTrail();

export { AuditTrail, auditTrail };
export type { AuditEntry };