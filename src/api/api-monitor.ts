import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface ApiCall {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  requestData?: any;
  requestHeaders?: Record<string, string>;
  status?: number;
  responseData?: any;
  responseHeaders?: Record<string, string>;
  duration: number;
  error?: {
    message: string;
    code?: string;
    stack?: string;
    response?: any;
  };
}

class ApiMonitor {
  private apiCalls: ApiCall[] = [];
  private maxLogs = 100;
  private listeners: Array<() => void> = [];

  constructor() {
    // Khởi tạo từ localStorage nếu đang chạy trên client
    if (typeof window !== "undefined") {
      try {
        const savedLogs = localStorage.getItem("api_monitor_logs");
        if (savedLogs) {
          this.apiCalls = JSON.parse(savedLogs);
        }
      } catch (error) {
        console.error("Lỗi khi khôi phục logs API:", error);
      }
    }
  }

  public onRequest(config: InternalAxiosRequestConfig): void {
    const id = this.generateId();
    const timestamp = Date.now();

    // Lọc bỏ các header nhạy cảm
    const safeHeaders = { ...config.headers } as Record<string, string>;
    if (safeHeaders.Authorization) {
      safeHeaders.Authorization =
        safeHeaders.Authorization.substring(0, 15) + "...";
    }

    const apiCall: ApiCall = {
      id,
      timestamp,
      method: config.method?.toUpperCase() || "UNKNOWN",
      url: config.url || "UNKNOWN",
      requestData: config.data,
      requestHeaders: safeHeaders,
      duration: 0,
    };

    // Thêm thuộc tính tùy chỉnh để theo dõi apiCall
    (config as any).__apiCallId = id;
    (config as any).__apiCallStartTime = timestamp;

    this.apiCalls.unshift(apiCall);
    this.trimLogs();
    this.save();
    this.notifyListeners();
  }

  public onResponse(response: AxiosResponse): void {
    const config = response.config as any;
    const id = config.__apiCallId;
    const startTime = config.__apiCallStartTime;

    if (id && startTime) {
      const apiCall = this.apiCalls.find((call) => call.id === id);
      if (apiCall) {
        apiCall.status = response.status;
        apiCall.responseData = response.data;
        apiCall.responseHeaders = response.headers as Record<string, string>;
        apiCall.duration = Date.now() - startTime;
        this.save();
        this.notifyListeners();
      }
    }
  }

  public onError(error: AxiosError): void {
    const config = error.config as any;
    const id = config?.__apiCallId;
    const startTime = config?.__apiCallStartTime;

    if (id && startTime) {
      const apiCall = this.apiCalls.find((call) => call.id === id);
      if (apiCall) {
        apiCall.status = error.response?.status;
        apiCall.responseData = error.response?.data;
        apiCall.responseHeaders = error.response?.headers as Record<
          string,
          string
        >;
        apiCall.duration = Date.now() - startTime;
        apiCall.error = {
          message: error.message,
          code: error.code,
          stack: error.stack,
          response: error.response?.data,
        };
        this.save();
        this.notifyListeners();
      }
    }
  }

  public getAllCalls(): ApiCall[] {
    return [...this.apiCalls];
  }

  public clearLogs(): void {
    this.apiCalls = [];
    this.save();
    this.notifyListeners();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  private trimLogs(): void {
    if (this.apiCalls.length > this.maxLogs) {
      this.apiCalls = this.apiCalls.slice(0, this.maxLogs);
    }
  }

  private save(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("api_monitor_logs", JSON.stringify(this.apiCalls));
      } catch (error) {
        console.error("Lỗi khi lưu logs API:", error);
      }
    }
  }
}

// Singleton instance
export const apiMonitor = new ApiMonitor();

export default apiMonitor;
