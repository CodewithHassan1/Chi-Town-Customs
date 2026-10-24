import { contextBridge, ipcRenderer } from "electron";

export interface DesktopApi {
  ping: () => Promise<{ online: boolean; latencyMs?: number; backendUrl: string; error?: string }>;
  sync: () => Promise<any>;
  lookup: (query: string) => Promise<any>;
  adjust: (payload: {
    variantId: string;
    quantityDelta: number;
    reason?: string;
    staffName?: string;
  }) => Promise<any>;
  receive: (payload: any) => Promise<any>;
  orders: (filters?: { status?: string; search?: string }) => Promise<any>;
  updateOrder: (payload: { orderId: string; status: string; notes?: string }) => Promise<any>;
  print: () => Promise<{ success: boolean; error?: string }>;
  systemInfo: () => Promise<any>;
}

const desktopApi: DesktopApi = {
  ping: () => ipcRenderer.invoke("desktop:ping"),
  sync: () => ipcRenderer.invoke("desktop:sync"),
  lookup: (query: string) => ipcRenderer.invoke("desktop:lookup", query),
  adjust: (payload) => ipcRenderer.invoke("desktop:adjust", payload),
  receive: (payload) => ipcRenderer.invoke("desktop:receive", payload),
  orders: (filters) => ipcRenderer.invoke("desktop:orders", filters),
  updateOrder: (payload) => ipcRenderer.invoke("desktop:update-order", payload),
  print: () => ipcRenderer.invoke("desktop:print"),
  systemInfo: () => ipcRenderer.invoke("desktop:system-info"),
};

contextBridge.exposeInMainWorld("desktopApi", desktopApi);
