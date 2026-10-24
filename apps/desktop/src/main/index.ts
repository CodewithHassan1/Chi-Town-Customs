import { app, BrowserWindow, ipcMain, shell, session } from "electron";
import * as path from "path";

const BACKEND_URL = process.env.CHI_TOWN_API_URL || "http://localhost:3000";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: "Chi-Town Customs USA — Shop Operations & Inventory Client",
    backgroundColor: "#08090B",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Enforce restrictive Content Security Policy (CSP)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' 'unsafe-inline' data:; connect-src 'self' http://localhost:3000 https:; img-src 'self' data: https: http:; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        ],
      },
    });
  });

  mainWindow.setMenuBarVisibility(false);

  // Load the renderer UI
  const rendererPath = path.join(__dirname, "../renderer/index.html");
  mainWindow.loadFile(rendererPath);

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Handle external link clicks securely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Register IPC handlers for authoritative backend communications
function registerIpcHandlers() {
  // 1. Health Ping
  ipcMain.handle("desktop:ping", async () => {
    try {
      const start = Date.now();
      const res = await fetch(`${BACKEND_URL}/api/desktop/sync`);
      const latencyMs = Date.now() - start;
      return { online: res.ok, status: res.status, latencyMs, backendUrl: BACKEND_URL };
    } catch (err: any) {
      return { online: false, error: err.message, backendUrl: BACKEND_URL };
    }
  });

  // 2. Full Inventory & Recent Movements Sync
  ipcMain.handle("desktop:sync", async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/desktop/sync`);
      if (!res.ok) {
        throw new Error(`Sync failed with HTTP status ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // 3. Quick Barcode or SKU Lookup
  ipcMain.handle("desktop:lookup", async (_event, query: string) => {
    try {
      const q = encodeURIComponent(query.trim());
      const res = await fetch(`${BACKEND_URL}/api/desktop/sync?barcode=${q}&sku=${q}`);
      if (!res.ok) {
        if (res.status === 404) return { success: false, notFound: true };
        throw new Error(`Lookup failed with HTTP status ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // 4. Barcode / Quick Stock Adjustment
  ipcMain.handle(
    "desktop:adjust",
    async (
      _event,
      payload: {
        variantId: string;
        quantityDelta: number;
        reason?: string;
        staffName?: string;
      }
    ) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/desktop/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "BARCODE_ADJUST",
            ...payload,
          }),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
  );

  // 5. Stock Receiving (Purchase Order or Supplier Delivery)
  ipcMain.handle("desktop:receive", async (_event, payload: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/inventory/receive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // 6. Fetch Orders (Store Pickups and Online Deliveries)
  ipcMain.handle("desktop:orders", async (_event, filters?: { status?: string; search?: string }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.search) params.set("search", filters.search);

      const res = await fetch(`${BACKEND_URL}/api/orders?${params.toString()}`);
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // 7. Update Order Fulfillment Status
  ipcMain.handle("desktop:update-order", async (_event, { orderId, status, notes }: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes: notes }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // 8. Print Receipt / In-Store Ticket
  ipcMain.handle("desktop:print", async () => {
    if (!mainWindow) return { success: false, error: "Window not active" };
    mainWindow.webContents.print({ silent: false, printBackground: true });
    return { success: true };
  });

  // 9. System & Shop Metadata
  ipcMain.handle("desktop:system-info", () => {
    return {
      appName: "Chi-Town Customs USA Operations Suite",
      appVersion: "1.0.0",
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      backendUrl: BACKEND_URL,
      shop: {
        name: "Chi-Town Customs USA",
        address: "311 N Cicero Ave, Chicago, IL 60644",
        phone: "+1 773-287-3000",
        timezone: "America/Chicago",
      },
    };
  });
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
