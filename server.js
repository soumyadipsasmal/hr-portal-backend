// const http = require("http");
// const fs = require("fs");
// const path = require("path");
// const { URL } = require("url");
// const getDefaultState = require("./default-state");

// // const PORT = Number(process.env.PORT || 3000);
// const PORT = Number(process.env.PORT || 5000);
// const FRONTEND_DIR = process.env.FRONTEND_DIR
//   ? path.resolve(process.env.FRONTEND_DIR)
//   : path.join(__dirname, "..", "task-manager-frontend");
// const DATA_DIR = path.join(__dirname, "data");
// const STORE_FILE = path.join(DATA_DIR, "store.json");
// const DEMO_NOW = "2026-04-06T10:00:00.000Z";
// const ADMIN_ROLES = new Set(["Admin", "Manager", "HR"]);

// ensureStore();

// // const server = http.createServer(async (req, res) => {
// //   try {
// //     const url = new URL(req.url, `http://${req.headers.host}`);

// //     if (url.pathname.startsWith("/api/")) {
// //       await handleApi(req, res, url);
// //       return;
// //     }

// //     serveStatic(res, url.pathname);
// //   } catch (error) {
// //     sendJson(res, 500, { error: error.message || "Internal server error" });
// //   }
// // });
// const server = http.createServer(async (req, res) => {
//   try {
//     // ✅ CORS HEADERS (VERY IMPORTANT)
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//     // ✅ HANDLE PREFLIGHT REQUEST
//     if (req.method === "OPTIONS") {
//       res.writeHead(200);
//       res.end();
//       return;
//     }

//     const url = new URL(req.url, `http://${req.headers.host}`);

//     if (url.pathname.startsWith("/api/")) {
//       await handleApi(req, res, url);
//       return;
//     }

//     serveStatic(res, url.pathname);
//   } catch (error) {
//     sendJson(res, 500, { error: error.message || "Internal server error" });
//   }
// });

// // server.listen(PORT, () => {
// //   console.log(`SoumyaFlow server running at http://localhost:${PORT}`);
// // });
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`SoumyaFlow server running at http://0.0.0.0:${PORT}`);
// });
// async function handleApi(req, res, url) {
//   const { pathname } = url;

//   if (req.method === "GET" && pathname === "/api/state") {
//     return sendState(res, readState());
//   }

//   if (req.method === "POST" && pathname === "/api/reset") {
//     const state = getDefaultState();
//     writeState(state);
//     return sendState(res, state, "Workspace reset successfully.");
//   }

//   const body = await readJsonBody(req);
//   const state = readState();

//   if (req.method === "POST" && pathname === "/api/auth/login") {
//     if (!body.password) {
//       return sendJson(res, 400, { error: "Password is required." });
//     }
//     if (state.security.requireTwoFactor && String(body.otp || "").trim().length < 6) {
//       return sendJson(res, 400, { error: "A 6-digit OTP is required." });
//     }
//     const userId = body.userId || state.session.userId;
//     state.session.loggedIn = true;
//     state.session.userId = userId;
//     state.session.lastActivity = nextEventTimestamp(state);
//     state.security.loginHistory.unshift(createLoginHistoryEntry(state, userId, "Login"));
//     writeState(state);
//     return sendState(res, state, `${getUserName(state, userId)} logged in successfully.`);
//   }

//   if (req.method === "POST" && pathname === "/api/auth/logout") {
//     state.security.loginHistory.unshift(createLoginHistoryEntry(state, state.session.userId, "Logout"));
//     state.session.loggedIn = false;
//     writeState(state);
//     return sendState(res, state, "Session locked.");
//   }

//   if (req.method === "POST" && pathname === "/api/auth/forgot-password") {
//     if (!state.security.forgotPasswordEnabled) {
//       return sendJson(res, 400, { error: "Forgot password is disabled by policy." });
//     }
//     const userId = body.userId || state.session.userId;
//     state.security.loginHistory.unshift(createLoginHistoryEntry(state, userId, "Forgot Password"));
//     addNotification(state, {
//       title: "Password reset requested",
//       message: "A password reset request was recorded by the backend.",
//       type: "security",
//       userId,
//     });
//     writeState(state);
//     return sendState(res, state, "Password reset request recorded.");
//   }

//   if (req.method === "POST" && pathname === "/api/auth/change-password") {
//     const userId = body.userId || state.session.userId;
//     state.security.passwordChangedAt = nextEventTimestamp(state);
//     state.security.loginHistory.unshift(createLoginHistoryEntry(state, userId, "Password Changed"));
//     addNotification(state, {
//       title: "Password updated",
//       message: "Password rotation was saved by the backend.",
//       type: "security",
//       userId,
//     });
//     writeState(state);
//     return sendState(res, state, "Password change recorded.");
//   }

//   if (req.method === "POST" && pathname === "/api/tasks") {
//     const task = {
//       id: createIssueId(state, body.project),
//       title: body.title,
//       project: body.project,
//       assigneeId: body.assigneeId,
//       priority: body.priority,
//       type: body.type,
//       status: body.status,
//       points: Number(body.points) || 0,
//       dueDate: body.dueDate,
//       reminderAt: body.reminderAt || "",
//       recurring: Boolean(body.recurring),
//       description: body.description || "No description provided yet.",
//       labels: Array.isArray(body.labels) ? body.labels : [],
//       blocked: Boolean(body.blocked),
//       files: Array.isArray(body.files) ? body.files : [],
//       comments: Array.isArray(body.comments) ? body.comments : [],
//       createdAt: nextEventTimestamp(state),
//     };
//     state.tasks.unshift(task);
//     addNotification(state, {
//       title: "Task assigned",
//       message: `${task.id} was assigned to ${getUserName(state, task.assigneeId)}.`,
//       type: "task",
//       userId: task.assigneeId,
//     });
//     writeState(state);
//     return sendState(res, state, `${task.id} created successfully.`);
//   }

//   const taskStatusMatch = pathname.match(/^\/api\/tasks\/([^/]+)\/status$/);
//   if (req.method === "PATCH" && taskStatusMatch) {
//     const task = state.tasks.find((item) => item.id === decodeURIComponent(taskStatusMatch[1]));
//     if (!task) {
//       return sendJson(res, 404, { error: "Task not found." });
//     }
//     task.status = body.status;
//     addNotification(state, {
//       title: "Task status changed",
//       message: `${task.id} moved to ${body.status}.`,
//       type: "task",
//       userId: task.assigneeId,
//     });
//     writeState(state);
//     return sendState(res, state, `${task.id} updated.`);
//   }

//   if (req.method === "POST" && pathname === "/api/attendance") {
//     const existing = state.attendance.find((item) => item.employeeId === body.employeeId && item.date === body.date);
//     const payload = {
//       employeeId: body.employeeId,
//       date: body.date,
//       loginTime: body.loginTime,
//       logoutTime: body.logoutTime,
//       breakMinutes: Number(body.breakMinutes) || 0,
//       workMode: body.workMode,
//       biometricVerified: Boolean(body.biometricVerified),
//     };
//     if (existing) {
//       Object.assign(existing, payload);
//     } else {
//       state.attendance.unshift({ id: createId(state, "ATT"), ...payload });
//     }
//     addNotification(state, {
//       title: "Attendance updated",
//       message: `${getUserName(state, body.employeeId)} attendance saved for ${body.date}.`,
//       type: "attendance",
//       userId: body.employeeId,
//     });
//     writeState(state);
//     return sendState(res, state, "Attendance saved.");
//   }

//   if (req.method === "POST" && pathname === "/api/work-logs") {
//     state.workLogs.unshift({
//       id: createId(state, "LOG"),
//       employeeId: body.employeeId,
//       date: body.date,
//       project: body.project,
//       hours: Number(body.hours) || 0,
//       note: body.note || "",
//       time: nextEventTimestamp(state),
//     });
//     addNotification(state, {
//       title: "Work log submitted",
//       message: `${getUserName(state, body.employeeId)} logged ${Number(body.hours || 0).toFixed(1)}h for ${body.project}.`,
//       type: "timesheet",
//       userId: body.employeeId,
//     });
//     writeState(state);
//     return sendState(res, state, "Work log saved.");
//   }

//   if (req.method === "POST" && pathname === "/api/leaves") {
//     state.leaves.unshift({
//       id: createId(state, "LEV"),
//       employeeId: body.employeeId,
//       type: body.type,
//       fromDate: body.fromDate,
//       toDate: body.toDate,
//       days: calculateLeaveDays(body.fromDate, body.toDate),
//       status: "Pending",
//       approverId: state.session.userId,
//       reason: body.reason || "",
//       createdAt: nextEventTimestamp(state),
//     });
//     addNotification(state, {
//       title: "Leave request submitted",
//       message: `${getUserName(state, body.employeeId)} requested ${body.type.toLowerCase()} leave.`,
//       type: "leave",
//       audience: "Managers",
//     });
//     writeState(state);
//     return sendState(res, state, "Leave request submitted.");
//   }

//   const leaveStatusMatch = pathname.match(/^\/api\/leaves\/([^/]+)\/status$/);
//   if (req.method === "PATCH" && leaveStatusMatch) {
//     const leave = state.leaves.find((item) => item.id === decodeURIComponent(leaveStatusMatch[1]));
//     if (!leave) {
//       return sendJson(res, 404, { error: "Leave request not found." });
//     }
//     if (!hasAdminAccess(state)) {
//       return sendJson(res, 403, { error: "Admin, manager, or HR access required." });
//     }
//     if (leave.status !== "Approved" && body.status === "Approved") {
//       const user = getUserById(state, leave.employeeId);
//       user.leaveBalance[leave.type] = Math.max(0, user.leaveBalance[leave.type] - leave.days);
//     }
//     leave.status = body.status;
//     leave.approverId = state.session.userId;
//     addNotification(state, {
//       title: `Leave ${body.status.toLowerCase()}`,
//       message: `${leave.id} was ${body.status.toLowerCase()}.`,
//       type: "leave",
//       userId: leave.employeeId,
//     });
//     writeState(state);
//     return sendState(res, state, `Leave ${leave.id} updated.`);
//   }

//   if (req.method === "POST" && pathname === "/api/security") {
//     state.security.sessionTimeoutMinutes = Number(body.sessionTimeoutMinutes) || state.security.sessionTimeoutMinutes;
//     state.security.jwtEnabled = Boolean(body.jwtEnabled);
//     state.security.requireTwoFactor = Boolean(body.requireTwoFactor);
//     state.security.forgotPasswordEnabled = Boolean(body.forgotPasswordEnabled);
//     state.security.loginHistory.unshift(createLoginHistoryEntry(state, state.session.userId, "Security Policy Updated"));
//     writeState(state);
//     return sendState(res, state, "Security settings updated.");
//   }

//   if (req.method === "POST" && pathname === "/api/announcements") {
//     addNotification(state, {
//       title: body.title,
//       message: body.message || "Company announcement posted.",
//       type: "announcement",
//       audience: body.audience || "All",
//     });
//     writeState(state);
//     return sendState(res, state, "Announcement sent.");
//   }

//   if (req.method === "POST" && pathname === "/api/notifications/read-all") {
//     const userId = body.userId || state.session.userId;
//     state.notifications.forEach((notification) => {
//       if (notificationAppliesToUser(state, notification, userId)) {
//         notification.read = true;
//       }
//     });
//     writeState(state);
//     return sendState(res, state, "Notifications marked as read.");
//   }

//   const notificationMatch = pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
//   if (req.method === "PATCH" && notificationMatch) {
//     const notification = state.notifications.find((item) => item.id === decodeURIComponent(notificationMatch[1]));
//     if (!notification) {
//       return sendJson(res, 404, { error: "Notification not found." });
//     }
//     notification.read = true;
//     writeState(state);
//     return sendState(res, state, "Notification marked as read.");
//   }

//   sendJson(res, 404, { error: "Endpoint not found." });
// }

// function serveStatic(res, pathname) {
//   const targetPath = pathname === "/" ? "/index.html" : pathname;
//   const filePath = path.normalize(path.join(FRONTEND_DIR, targetPath.replace(/^\/+/, "")));
//   if (!filePath.startsWith(FRONTEND_DIR)) {
//     return sendJson(res, 403, { error: "Forbidden" });
//   }
//   if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
//     return sendJson(res, 404, { error: "Not found" });
//   }
//   res.writeHead(200, { "Content-Type": getMimeType(filePath) });
//   fs.createReadStream(filePath).pipe(res);
// }

// function ensureStore() {
//   if (!fs.existsSync(DATA_DIR)) {
//     fs.mkdirSync(DATA_DIR, { recursive: true });
//   }
//   if (!fs.existsSync(STORE_FILE)) {
//     fs.writeFileSync(STORE_FILE, JSON.stringify(getDefaultState(), null, 2));
//   }
// }

// function readState() {
//   ensureStore();
//   return JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
// }

// function writeState(state) {
//   fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2));
// }

// function sendState(res, state, message = "") {
//   sendJson(res, 200, { state, message });
// }

// function sendJson(res, statusCode, payload) {
//   res.writeHead(statusCode, {
//     "Content-Type": "application/json; charset=utf-8",
//     "Cache-Control": "no-store",
//   });
//   res.end(JSON.stringify(payload));
// }

// function readJsonBody(req) {
//   return new Promise((resolve, reject) => {
//     let raw = "";
//     req.on("data", (chunk) => {
//       raw += chunk;
//     });
//     req.on("end", () => {
//       if (!raw) {
//         resolve({});
//         return;
//       }
//       try {
//         resolve(JSON.parse(raw));
//       } catch (error) {
//         reject(error);
//       }
//     });
//     req.on("error", reject);
//   });
// }

// function createId(state, prefix) {
//   state.meta.sequence += 1;
//   return `${prefix}-${String(state.meta.sequence).padStart(3, "0")}`;
// }

// function nextEventTimestamp(state) {
//   return new Date(new Date(DEMO_NOW).getTime() + state.meta.sequence * 600000).toISOString();
// }

// function createLoginHistoryEntry(state, userId, action) {
//   return {
//     id: createId(state, "LGN"),
//     userId,
//     action,
//     time: nextEventTimestamp(state),
//     device: "Desktop App",
//     location: "Hyderabad Office",
//     success: true,
//   };
// }

// function addNotification(state, { title, message, type, userId = "", audience = "All" }) {
//   state.notifications.unshift({
//     id: createId(state, "NTF"),
//     title,
//     message,
//     type,
//     userId,
//     audience,
//     time: nextEventTimestamp(state),
//     read: false,
//   });
// }

// function createIssueId(state, projectName) {
//   const prefix = String(projectName || "GEN")
//     .split(/\s+/)
//     .map((part) => part[0] || "")
//     .join("")
//     .toUpperCase()
//     .padEnd(3, "X")
//     .slice(0, 3);
//   const maxValue = state.tasks
//     .filter((task) => task.id.startsWith(prefix))
//     .map((task) => Number(task.id.split("-")[1]) || 0)
//     .reduce((max, value) => Math.max(max, value), 0);
//   return `${prefix}-${String(maxValue + 1).padStart(3, "0")}`;
// }

// function calculateLeaveDays(fromDate, toDate) {
//   const start = new Date(fromDate);
//   const end = new Date(toDate);
//   return Math.max(1, Math.round((end - start) / 86400000) + 1);
// }

// function getCurrentUser(state) {
//   return getUserById(state, state.session.userId);
// }

// function getUserById(state, userId) {
//   return state.users.find((user) => user.id === userId);
// }

// function getUserName(state, userId) {
//   const user = getUserById(state, userId);
//   return user ? user.name : "Unknown User";
// }

// function hasAdminAccess(state) {
//   const currentUser = getCurrentUser(state);
//   return currentUser ? ADMIN_ROLES.has(currentUser.role) : false;
// }

// function notificationAppliesToUser(state, notification, userId) {
//   const user = getUserById(state, userId);
//   if (!user) {
//     return false;
//   }
//   if (notification.userId) {
//     return notification.userId === userId;
//   }
//   if (notification.audience === "All") {
//     return true;
//   }
//   if (notification.audience === "Managers") {
//     return user.role === "Manager" || user.role === "Admin";
//   }
//   if (notification.audience === "Engineering") {
//     return user.department === "Technology";
//   }
//   if (notification.audience === "HR") {
//     return user.role === "HR" || user.department === "People Ops";
//   }
//   return true;
// }

// function getMimeType(filePath) {
//   const extension = path.extname(filePath).toLowerCase();
//   if (extension === ".html") return "text/html; charset=utf-8";
//   if (extension === ".css") return "text/css; charset=utf-8";
//   if (extension === ".js") return "application/javascript; charset=utf-8";
//   if (extension === ".json") return "application/json; charset=utf-8";
//   return "text/plain; charset=utf-8";
// }
// add code here --------------------------------------------------------------------------------------------------------
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const getDefaultState = require("./default-state");

// const PORT = Number(process.env.PORT || 3000);
const PORT = Number(process.env.PORT || 5000);
const FRONTEND_DIR = process.env.FRONTEND_DIR
  ? path.resolve(process.env.FRONTEND_DIR)
  : path.join(__dirname, "..", "hr-portal-frontend");
const DATA_DIR = path.join(__dirname, "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const DEMO_NOW = "2026-04-06T10:00:00.000Z";
const ADMIN_ROLES = new Set(["Admin", "Manager", "HR"]);

ensureStore();

// const server = http.createServer(async (req, res) => {
//   try {
//     const url = new URL(req.url, `http://${req.headers.host}`);

//     if (url.pathname.startsWith("/api/")) {
//       await handleApi(req, res, url);
//       return;
//     }

//     serveStatic(res, url.pathname);
//   } catch (error) {
//     sendJson(res, 500, { error: error.message || "Internal server error" });
//   }
// });
const server = http.createServer(async (req, res) => {
  try {
    // ✅ CORS HEADERS (VERY IMPORTANT)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // ✅ HANDLE PREFLIGHT REQUEST
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    serveStatic(res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

// server.listen(PORT, () => {
//   console.log(`SoumyaFlow server running at http://localhost:${PORT}`);
// });
server.listen(PORT, '0.0.0.0', () => {
  console.log(`SoumyaFlow server running at http://0.0.0.0:${PORT}`);
});
async function handleApi(req, res, url) {
  const { pathname } = url;

  if (req.method === "GET" && pathname === "/api/state") {
    return sendState(res, readState());
  }

  if (req.method === "POST" && pathname === "/api/reset") {
    const state = getDefaultState();
    writeState(state);
    return sendState(res, state, "Workspace reset successfully.");
  }

  const body = await readJsonBody(req);
  const state = readState();

  if (req.method === "POST" && pathname === "/api/auth/login") {
    if (!body.password) {
      return sendJson(res, 400, { error: "Password is required." });
    }
    if (state.security.requireTwoFactor && String(body.otp || "").trim().length < 6) {
      return sendJson(res, 400, { error: "A 6-digit OTP is required." });
    }
    const userId = body.userId || state.session.userId;
    state.session.loggedIn = true;
    state.session.userId = userId;
    state.session.lastActivity = nextEventTimestamp(state);
    state.security.loginHistory.unshift(createLoginHistoryEntry(state, userId, "Login"));
    writeState(state);
    return sendState(res, state, `${getUserName(state, userId)} logged in successfully.`);
  }

  if (req.method === "POST" && pathname === "/api/auth/logout") {
    state.security.loginHistory.unshift(createLoginHistoryEntry(state, state.session.userId, "Logout"));
    state.session.loggedIn = false;
    writeState(state);
    return sendState(res, state, "Session locked.");
  }

  if (req.method === "POST" && pathname === "/api/auth/forgot-password") {
    if (!state.security.forgotPasswordEnabled) {
      return sendJson(res, 400, { error: "Forgot password is disabled by policy." });
    }
    const userId = body.userId || state.session.userId;
    state.security.loginHistory.unshift(createLoginHistoryEntry(state, userId, "Forgot Password"));
    addNotification(state, {
      title: "Password reset requested",
      message: "A password reset request was recorded by the backend.",
      type: "security",
      userId,
    });
    writeState(state);
    return sendState(res, state, "Password reset request recorded.");
  }

  if (req.method === "POST" && pathname === "/api/auth/change-password") {
    const userId = body.userId || state.session.userId;
    state.security.passwordChangedAt = nextEventTimestamp(state);
    state.security.loginHistory.unshift(createLoginHistoryEntry(state, userId, "Password Changed"));
    addNotification(state, {
      title: "Password updated",
      message: "Password rotation was saved by the backend.",
      type: "security",
      userId,
    });
    writeState(state);
    return sendState(res, state, "Password change recorded.");
  }

  if (req.method === "POST" && pathname === "/api/tasks") {
    const task = {
      id: createIssueId(state, body.project),
      title: body.title,
      project: body.project,
      assigneeId: body.assigneeId,
      priority: body.priority,
      type: body.type,
      status: body.status,
      points: Number(body.points) || 0,
      dueDate: body.dueDate,
      reminderAt: body.reminderAt || "",
      recurring: Boolean(body.recurring),
      description: body.description || "No description provided yet.",
      labels: Array.isArray(body.labels) ? body.labels : [],
      blocked: Boolean(body.blocked),
      files: Array.isArray(body.files) ? body.files : [],
      comments: Array.isArray(body.comments) ? body.comments : [],
      createdAt: nextEventTimestamp(state),
    };
    state.tasks.unshift(task);
    addNotification(state, {
      title: "Task assigned",
      message: `${task.id} was assigned to ${getUserName(state, task.assigneeId)}.`,
      type: "task",
      userId: task.assigneeId,
    });
    writeState(state);
    return sendState(res, state, `${task.id} created successfully.`);
  }

  const taskStatusMatch = pathname.match(/^\/api\/tasks\/([^/]+)\/status$/);
  if (req.method === "PATCH" && taskStatusMatch) {
    const task = state.tasks.find((item) => item.id === decodeURIComponent(taskStatusMatch[1]));
    if (!task) {
      return sendJson(res, 404, { error: "Task not found." });
    }
    task.status = body.status;
    addNotification(state, {
      title: "Task status changed",
      message: `${task.id} moved to ${body.status}.`,
      type: "task",
      userId: task.assigneeId,
    });
    writeState(state);
    return sendState(res, state, `${task.id} updated.`);
  }

  if (req.method === "POST" && pathname === "/api/attendance") {
    const existing = state.attendance.find((item) => item.employeeId === body.employeeId && item.date === body.date);
    const payload = {
      employeeId: body.employeeId,
      date: body.date,
      loginTime: body.loginTime,
      logoutTime: body.logoutTime,
      breakMinutes: Number(body.breakMinutes) || 0,
      workMode: body.workMode,
      biometricVerified: Boolean(body.biometricVerified),
    };
    if (existing) {
      Object.assign(existing, payload);
    } else {
      state.attendance.unshift({ id: createId(state, "ATT"), ...payload });
    }
    addNotification(state, {
      title: "Attendance updated",
      message: `${getUserName(state, body.employeeId)} attendance saved for ${body.date}.`,
      type: "attendance",
      userId: body.employeeId,
    });
    writeState(state);
    return sendState(res, state, "Attendance saved.");
  }

  if (req.method === "POST" && pathname === "/api/work-logs") {
    state.workLogs.unshift({
      id: createId(state, "LOG"),
      employeeId: body.employeeId,
      date: body.date,
      project: body.project,
      hours: Number(body.hours) || 0,
      note: body.note || "",
      time: nextEventTimestamp(state),
    });
    addNotification(state, {
      title: "Work log submitted",
      message: `${getUserName(state, body.employeeId)} logged ${Number(body.hours || 0).toFixed(1)}h for ${body.project}.`,
      type: "timesheet",
      userId: body.employeeId,
    });
    writeState(state);
    return sendState(res, state, "Work log saved.");
  }

  if (req.method === "POST" && pathname === "/api/leaves") {
    state.leaves.unshift({
      id: createId(state, "LEV"),
      employeeId: body.employeeId,
      type: body.type,
      fromDate: body.fromDate,
      toDate: body.toDate,
      days: calculateLeaveDays(body.fromDate, body.toDate),
      status: "Pending",
      approverId: state.session.userId,
      reason: body.reason || "",
      createdAt: nextEventTimestamp(state),
    });
    addNotification(state, {
      title: "Leave request submitted",
      message: `${getUserName(state, body.employeeId)} requested ${body.type.toLowerCase()} leave.`,
      type: "leave",
      audience: "Managers",
    });
    writeState(state);
    return sendState(res, state, "Leave request submitted.");
  }

  const leaveStatusMatch = pathname.match(/^\/api\/leaves\/([^/]+)\/status$/);
  if (req.method === "PATCH" && leaveStatusMatch) {
    const leave = state.leaves.find((item) => item.id === decodeURIComponent(leaveStatusMatch[1]));
    if (!leave) {
      return sendJson(res, 404, { error: "Leave request not found." });
    }
    if (!hasAdminAccess(state)) {
      return sendJson(res, 403, { error: "Admin, manager, or HR access required." });
    }
    if (leave.status !== "Approved" && body.status === "Approved") {
      const user = getUserById(state, leave.employeeId);
      if (user && user.leaveBalance && leave.type in user.leaveBalance) {
        user.leaveBalance[leave.type] = Math.max(0, user.leaveBalance[leave.type] - leave.days);
      }
    }
    leave.status = body.status;
    leave.approverId = state.session.userId;
    addNotification(state, {
      title: `Leave ${body.status.toLowerCase()}`,
      message: `${leave.id} was ${body.status.toLowerCase()}.`,
      type: "leave",
      userId: leave.employeeId,
    });
    writeState(state);
    return sendState(res, state, `Leave ${leave.id} updated.`);
  }

  if (req.method === "POST" && pathname === "/api/security") {
    state.security.sessionTimeoutMinutes = Number(body.sessionTimeoutMinutes) || state.security.sessionTimeoutMinutes;
    state.security.jwtEnabled = Boolean(body.jwtEnabled);
    state.security.requireTwoFactor = Boolean(body.requireTwoFactor);
    state.security.forgotPasswordEnabled = Boolean(body.forgotPasswordEnabled);
    state.security.loginHistory.unshift(createLoginHistoryEntry(state, state.session.userId, "Security Policy Updated"));
    writeState(state);
    return sendState(res, state, "Security settings updated.");
  }

  if (req.method === "POST" && pathname === "/api/announcements") {
    addNotification(state, {
      title: body.title,
      message: body.message || "Company announcement posted.",
      type: "announcement",
      audience: body.audience || "All",
    });
    writeState(state);
    return sendState(res, state, "Announcement sent.");
  }

  if (req.method === "POST" && pathname === "/api/notifications/read-all") {
    const userId = body.userId || state.session.userId;
    state.notifications.forEach((notification) => {
      if (notificationAppliesToUser(state, notification, userId)) {
        notification.read = true;
      }
    });
    writeState(state);
    return sendState(res, state, "Notifications marked as read.");
  }

  const notificationMatch = pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
  if (req.method === "PATCH" && notificationMatch) {
    const notification = state.notifications.find((item) => item.id === decodeURIComponent(notificationMatch[1]));
    if (!notification) {
      return sendJson(res, 404, { error: "Notification not found." });
    }
    notification.read = true;
    writeState(state);
    return sendState(res, state, "Notification marked as read.");
  }

  sendJson(res, 404, { error: "Endpoint not found." });
}

function serveStatic(res, pathname) {
  const targetPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(FRONTEND_DIR, targetPath.replace(/^\/+/, "")));
  if (!filePath.startsWith(FRONTEND_DIR)) {
    return sendJson(res, 403, { error: "Forbidden" });
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return sendJson(res, 404, { error: "Not found" });
  }
  res.writeHead(200, { "Content-Type": getMimeType(filePath) });
  fs.createReadStream(filePath).pipe(res);
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(getDefaultState(), null, 2));
  }
}

function readState() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
}

function writeState(state) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2));
}

function sendState(res, state, message = "") {
  sendJson(res, 200, { state, message });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function createId(state, prefix) {
  state.meta.sequence += 1;
  return `${prefix}-${String(state.meta.sequence).padStart(3, "0")}`;
}

function nextEventTimestamp(state) {
  return new Date(new Date(DEMO_NOW).getTime() + state.meta.sequence * 600000).toISOString();
}

function createLoginHistoryEntry(state, userId, action) {
  return {
    id: createId(state, "LGN"),
    userId,
    action,
    time: nextEventTimestamp(state),
    device: "Desktop App",
    location: "Hyderabad Office",
    success: true,
  };
}

function addNotification(state, { title, message, type, userId = "", audience = "All" }) {
  state.notifications.unshift({
    id: createId(state, "NTF"),
    title,
    message,
    type,
    userId,
    audience,
    time: nextEventTimestamp(state),
    read: false,
  });
}

function createIssueId(state, projectName) {
  const prefix = String(projectName || "GEN")
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase()
    .padEnd(3, "X")
    .slice(0, 3);
  const maxValue = state.tasks
    .filter((task) => task.id.startsWith(prefix))
    .map((task) => Number(task.id.split("-")[1]) || 0)
    .reduce((max, value) => Math.max(max, value), 0);
  return `${prefix}-${String(maxValue + 1).padStart(3, "0")}`;
}

function calculateLeaveDays(fromDate, toDate) {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

function getCurrentUser(state) {
  return getUserById(state, state.session.userId);
}

function getUserById(state, userId) {
  return state.users.find((user) => user.id === userId);
}

function getUserName(state, userId) {
  const user = getUserById(state, userId);
  return user ? user.name : "Unknown User";
}

function hasAdminAccess(state) {
  const currentUser = getCurrentUser(state);
  return currentUser ? ADMIN_ROLES.has(currentUser.role) : false;
}

function notificationAppliesToUser(state, notification, userId) {
  const user = getUserById(state, userId);
  if (!user) {
    return false;
  }
  if (notification.userId) {
    return notification.userId === userId;
  }
  if (notification.audience === "All") {
    return true;
  }
  if (notification.audience === "Managers") {
    return user.role === "Manager" || user.role === "Admin";
  }
  if (notification.audience === "Engineering") {
    return user.department === "Technology";
  }
  if (notification.audience === "HR") {
    return user.role === "HR" || user.department === "People Ops";
  }
  return false;
}

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".html") return "text/html; charset=utf-8";
  if (extension === ".css") return "text/css; charset=utf-8";
  if (extension === ".js") return "application/javascript; charset=utf-8";
  if (extension === ".json") return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}
