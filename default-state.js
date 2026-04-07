function getDefaultState() {
  return {
    activeView: "overview",
    meta: { sequence: 40 },
    filters: { query: "", project: "all", priority: "all", assignee: "all", status: "all" },
    session: { loggedIn: true, userId: "USR-001", lastActivity: "2026-04-02T09:40:00.000Z" },
    security: {
      jwtEnabled: true,
      requireTwoFactor: true,
      forgotPasswordEnabled: true,
      sessionTimeoutMinutes: 30,
      passwordChangedAt: "2026-03-28T19:10:00.000Z",
      loginHistory: [
        { id: "LGN-001", userId: "USR-001", action: "Login", time: "2026-04-02T03:42:00.000Z", device: "Desktop App", location: "Hyderabad Office", success: true },
        { id: "LGN-002", userId: "USR-001", action: "Password Changed", time: "2026-03-28T13:40:00.000Z", device: "Desktop App", location: "Remote", success: true },
        { id: "LGN-003", userId: "USR-002", action: "Login", time: "2026-04-02T03:20:00.000Z", device: "Web App", location: "Bengaluru", success: true },
        { id: "LGN-004", userId: "USR-004", action: "Forgot Password", time: "2026-03-29T09:10:00.000Z", device: "Web App", location: "Chennai", success: true }
      ]
    },
    users: [
      { id: "USR-001", name: "Aisha Khan", role: "Manager", department: "Operations", email: "aisha@soumyaflow.example.com", status: "Active", workMode: "WFH", leaveBalance: { Sick: 5, Casual: 4, Paid: 12 } },
      { id: "USR-002", name: "Rahul Verma", role: "Admin", department: "Technology", email: "rahul@soumyaflow.example.com", status: "Active", workMode: "Office", leaveBalance: { Sick: 6, Casual: 5, Paid: 14 } },
      { id: "USR-003", name: "Maya Singh", role: "Employee", department: "Product", email: "maya@soumyaflow.example.com", status: "Active", workMode: "Hybrid", leaveBalance: { Sick: 4, Casual: 3, Paid: 10 } },
      { id: "USR-004", name: "Nina Shah", role: "HR", department: "People Ops", email: "nina@soumyaflow.example.com", status: "Active", workMode: "Office", leaveBalance: { Sick: 7, Casual: 5, Paid: 13 } },
      { id: "USR-005", name: "Dev Patel", role: "Employee", department: "Security", email: "dev@soumyaflow.example.com", status: "Active", workMode: "Office", leaveBalance: { Sick: 5, Casual: 4, Paid: 11 } },
      { id: "USR-006", name: "Leena Joseph", role: "Employee", department: "Quality", email: "leena@soumyaflow.example.com", status: "Active", workMode: "Hybrid", leaveBalance: { Sick: 6, Casual: 4, Paid: 12 } }
    ],
    tasks: [
      { id: "OPS-142", title: "Launch executive reporting dashboard", description: "Combine sprint status, overdue work, and team health into one leadership view.", type: "Epic", priority: "Critical", status: "in-progress", project: "Operations Excellence", assigneeId: "USR-001", points: 13, dueDate: "2026-04-05", labels: ["dashboard", "leadership"], blocked: false, files: ["q2-reporting-plan.pdf"], comments: [{ author: "Rahul Verma", text: "Leadership review needs this before Monday.", time: "2026-04-01T08:20:00.000Z" }], recurring: false, reminderAt: "2026-04-03T09:00", createdAt: "2026-03-26T10:00:00.000Z" },
      { id: "APP-318", title: "Finish approval workflow for procurement requests", description: "Support multi-step review and approval with audit visibility for finance and ops.", type: "Story", priority: "High", status: "review", project: "Enterprise Platform", assigneeId: "USR-002", points: 8, dueDate: "2026-04-04", labels: ["workflow", "finance"], blocked: false, files: ["approval-schema.png"], comments: [{ author: "Aisha Khan", text: "Please validate the finance edge cases before release.", time: "2026-04-01T11:45:00.000Z" }], recurring: false, reminderAt: "2026-04-03T15:00", createdAt: "2026-03-27T09:00:00.000Z" },
      { id: "WEB-072", title: "Fix delayed notifications on task mentions", description: "Mention alerts are arriving late for some users during peak usage windows.", type: "Bug", priority: "Critical", status: "todo", project: "Customer Portal", assigneeId: "USR-003", points: 5, dueDate: "2026-04-03", labels: ["notifications", "bugfix"], blocked: true, files: [], comments: [{ author: "Leena Joseph", text: "Issue reproduced in regression cycle.", time: "2026-04-02T04:10:00.000Z" }], recurring: false, reminderAt: "2026-04-02T17:00", createdAt: "2026-03-29T14:00:00.000Z" },
      { id: "SEC-051", title: "Add permission matrix for admin roles", description: "Map workspace roles to fine-grained actions across boards, reports, and settings.", type: "Task", priority: "High", status: "in-progress", project: "Security Hardening", assigneeId: "USR-005", points: 8, dueDate: "2026-04-08", labels: ["roles", "security"], blocked: false, files: ["roles-matrix.xlsx"], comments: [{ author: "Nina Shah", text: "HR access needs leave-only permissions.", time: "2026-04-01T13:10:00.000Z" }], recurring: false, reminderAt: "", createdAt: "2026-03-28T12:00:00.000Z" },
      { id: "MOB-204", title: "Polish mobile backlog experience", description: "Reduce friction in creating, sorting, and updating issues from smaller screens.", type: "Story", priority: "Medium", status: "todo", project: "Mobile Experience", assigneeId: "USR-003", points: 5, dueDate: "2026-04-09", labels: ["mobile", "ux"], blocked: false, files: [], comments: [], recurring: false, reminderAt: "", createdAt: "2026-03-30T09:00:00.000Z" },
      { id: "QA-190", title: "Build regression checklist for sprint release", description: "Create a lightweight checklist so QA can verify the most sensitive workflows quickly.", type: "Task", priority: "Medium", status: "done", project: "Release Readiness", assigneeId: "USR-006", points: 3, dueDate: "2026-04-01", labels: ["qa", "release"], blocked: false, files: ["release-checklist.docx"], comments: [{ author: "Leena Joseph", text: "Checklist completed and shared with the release team.", time: "2026-04-01T16:30:00.000Z" }], recurring: true, reminderAt: "2026-04-08T09:30", createdAt: "2026-03-27T16:00:00.000Z" },
      { id: "CRM-447", title: "Sync customer account owner changes from CRM", description: "Reflect CRM ownership updates in internal workspaces to keep handoffs accurate.", type: "Story", priority: "High", status: "review", project: "Revenue Systems", assigneeId: "USR-001", points: 8, dueDate: "2026-04-06", labels: ["crm", "integration"], blocked: true, files: ["crm-sync-mapping.csv"], comments: [{ author: "Rahul Verma", text: "API payload now includes ownership metadata.", time: "2026-04-02T02:20:00.000Z" }], recurring: false, reminderAt: "2026-04-04T10:00", createdAt: "2026-03-31T09:00:00.000Z" },
      { id: "API-266", title: "Create SLA monitor for task processing APIs", description: "Track response thresholds and highlight production risks before they spread.", type: "Task", priority: "Medium", status: "in-progress", project: "Platform Reliability", assigneeId: "USR-002", points: 5, dueDate: "2026-04-10", labels: ["api", "monitoring"], blocked: false, files: ["sla-thresholds.json"], comments: [], recurring: true, reminderAt: "2026-04-03T11:00", createdAt: "2026-03-29T11:00:00.000Z" }
    ],
    attendance: [
      { id: "ATT-001", employeeId: "USR-001", date: "2026-03-29", loginTime: "09:08", logoutTime: "18:22", breakMinutes: 40, workMode: "WFH", biometricVerified: false },
      { id: "ATT-002", employeeId: "USR-001", date: "2026-03-30", loginTime: "09:18", logoutTime: "18:36", breakMinutes: 45, workMode: "WFH", biometricVerified: false },
      { id: "ATT-003", employeeId: "USR-001", date: "2026-03-31", loginTime: "09:11", logoutTime: "18:32", breakMinutes: 45, workMode: "Office", biometricVerified: true },
      { id: "ATT-004", employeeId: "USR-001", date: "2026-04-01", loginTime: "09:26", logoutTime: "18:18", breakMinutes: 35, workMode: "Office", biometricVerified: true },
      { id: "ATT-005", employeeId: "USR-001", date: "2026-04-02", loginTime: "09:12", logoutTime: "18:42", breakMinutes: 45, workMode: "WFH", biometricVerified: false },
      { id: "ATT-006", employeeId: "USR-002", date: "2026-04-02", loginTime: "08:58", logoutTime: "18:55", breakMinutes: 50, workMode: "Office", biometricVerified: true },
      { id: "ATT-007", employeeId: "USR-003", date: "2026-04-02", loginTime: "09:42", logoutTime: "17:36", breakMinutes: 50, workMode: "Hybrid", biometricVerified: false },
      { id: "ATT-008", employeeId: "USR-004", date: "2026-04-02", loginTime: "09:05", logoutTime: "18:21", breakMinutes: 40, workMode: "Office", biometricVerified: true },
      { id: "ATT-009", employeeId: "USR-005", date: "2026-04-02", loginTime: "09:20", logoutTime: "18:47", breakMinutes: 35, workMode: "Office", biometricVerified: true },
      { id: "ATT-010", employeeId: "USR-006", date: "2026-04-02", loginTime: "09:09", logoutTime: "18:14", breakMinutes: 45, workMode: "Hybrid", biometricVerified: false }
    ],
    workLogs: [
      { id: "LOG-001", employeeId: "USR-001", date: "2026-03-30", project: "Operations Excellence", hours: 3.5, note: "Built sprint health widgets.", time: "2026-03-30T12:00:00.000Z" },
      { id: "LOG-002", employeeId: "USR-001", date: "2026-03-31", project: "Revenue Systems", hours: 2.5, note: "Reviewed CRM sync edge cases.", time: "2026-03-31T13:00:00.000Z" },
      { id: "LOG-003", employeeId: "USR-001", date: "2026-04-01", project: "Operations Excellence", hours: 4, note: "Prepared leadership dashboard metrics.", time: "2026-04-01T11:00:00.000Z" },
      { id: "LOG-004", employeeId: "USR-001", date: "2026-04-02", project: "Revenue Systems", hours: 2, note: "Validated owner sync workflow.", time: "2026-04-02T05:30:00.000Z" },
      { id: "LOG-005", employeeId: "USR-002", date: "2026-04-02", project: "Platform Reliability", hours: 4.5, note: "Configured SLA alert thresholds.", time: "2026-04-02T05:10:00.000Z" },
      { id: "LOG-006", employeeId: "USR-003", date: "2026-04-02", project: "Customer Portal", hours: 5, note: "Investigated delayed mention notifications.", time: "2026-04-02T07:00:00.000Z" },
      { id: "LOG-007", employeeId: "USR-005", date: "2026-04-02", project: "Security Hardening", hours: 4, note: "Drafted role permission matrix.", time: "2026-04-02T06:00:00.000Z" },
      { id: "LOG-008", employeeId: "USR-006", date: "2026-04-01", project: "Release Readiness", hours: 3, note: "Closed regression checklist.", time: "2026-04-01T08:00:00.000Z" }
    ],
    leaves: [
      { id: "LEV-301", employeeId: "USR-003", type: "Sick", fromDate: "2026-04-08", toDate: "2026-04-09", days: 2, status: "Pending", approverId: "USR-001", reason: "Fever and rest", createdAt: "2026-04-02T04:20:00.000Z" },
      { id: "LEV-302", employeeId: "USR-006", type: "Paid", fromDate: "2026-04-15", toDate: "2026-04-16", days: 2, status: "Approved", approverId: "USR-004", reason: "Family event", createdAt: "2026-03-31T08:20:00.000Z" },
      { id: "LEV-303", employeeId: "USR-005", type: "Casual", fromDate: "2026-04-04", toDate: "2026-04-04", days: 1, status: "Approved", approverId: "USR-001", reason: "Personal work", createdAt: "2026-03-30T07:10:00.000Z" },
      { id: "LEV-304", employeeId: "USR-004", type: "Paid", fromDate: "2026-04-18", toDate: "2026-04-21", days: 4, status: "Pending", approverId: "USR-002", reason: "Travel leave", createdAt: "2026-04-01T09:30:00.000Z" }
    ],
    holidays: [
      { id: "HOL-001", name: "Ambedkar Jayanti", date: "2026-04-14", type: "Company" },
      { id: "HOL-002", name: "Good Friday", date: "2026-04-17", type: "Optional" },
      { id: "HOL-003", name: "Labour Day", date: "2026-05-01", type: "Company" },
      { id: "HOL-004", name: "Bakrid", date: "2026-05-27", type: "Optional" }
    ],
    notifications: [
      { id: "NTF-001", title: "Task assigned", message: "WEB-072 has been assigned to Maya Singh.", type: "task", userId: "USR-003", audience: "", time: "2026-04-02T04:30:00.000Z", read: false },
      { id: "NTF-002", title: "Deadline reminder", message: "OPS-142 is due on 05 Apr 2026.", type: "deadline", userId: "USR-001", audience: "", time: "2026-04-02T03:55:00.000Z", read: false },
      { id: "NTF-003", title: "Leave approval required", message: "Maya Singh submitted a sick leave request.", type: "leave", audience: "Managers", userId: "", time: "2026-04-02T04:25:00.000Z", read: false },
      { id: "NTF-004", title: "Admin announcement", message: "Quarterly town hall starts tomorrow at 4 PM.", type: "announcement", audience: "All", userId: "", time: "2026-04-01T10:30:00.000Z", read: true },
      { id: "NTF-005", title: "Security alert", message: "Password rotation policy was updated this week.", type: "security", audience: "All", userId: "", time: "2026-03-31T12:10:00.000Z", read: true },
      { id: "NTF-006", title: "Attendance reminder", message: "Please submit today’s work log before sign-off.", type: "attendance", userId: "USR-001", audience: "", time: "2026-04-02T05:00:00.000Z", read: false }
    ]
  };
}

module.exports = getDefaultState;
