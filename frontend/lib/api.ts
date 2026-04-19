function normalizeApiBase(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/**
 * Same-origin `/backend-proxy` → Next.js rewrites to Railway (no browser CORS).
 * - Explicit: `NEXT_PUBLIC_USE_API_PROXY=true` | `false`
 * - Auto in dev: HTTPS remote API (e.g. Railway) + `next dev` → proxy on without extra env
 */
function useBrowserBackendProxy(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "false") return false;
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "true") return true;
  const raw = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL || "");
  if (!raw || process.env.NODE_ENV !== "development") return false;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return false;
    return true;
  } catch {
    return false;
  }
}

function base(): string {
  const configured = normalizeApiBase(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  );
  if (useBrowserBackendProxy()) {
    return `${window.location.origin}/backend-proxy`;
  }
  return configured;
}

export function apiUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base()}${p}`;
}

export function mediaUrl(storedPath: string) {
  if (storedPath.startsWith("http")) return storedPath;
  return apiUrl(storedPath.startsWith("/") ? storedPath : `/${storedPath}`);
}

const USER_TOKEN_KEY = "user_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function setUserToken(token: string) {
  localStorage.setItem(USER_TOKEN_KEY, token);
}

export function clearUserSession() {
  localStorage.removeItem(USER_TOKEN_KEY);
}

export function adminAuthHeaders(): HeadersInit {
  const t = getAdminToken();
  const h: HeadersInit = { "Content-Type": "application/json" };
  if (t) (h as Record<string, string>)["Authorization"] = `Bearer ${t}`;
  return h;
}

export function userAuthHeaders(): HeadersInit {
  const t = getUserToken();
  const h: HeadersInit = { "Content-Type": "application/json" };
  if (t) (h as Record<string, string>)["Authorization"] = `Bearer ${t}`;
  return h;
}

/** Multipart uploads: only Bearer, no Content-Type */
export function userBearerHeaders(): HeadersInit {
  const t = getUserToken();
  const h: HeadersInit = {};
  if (t) (h as Record<string, string>)["Authorization"] = `Bearer ${t}`;
  return h;
}

export type AccountType = "individual" | "company";

export type UserProfile = {
  phone: string;
  email: string;
  age: number | null;
  accountType: AccountType;
  companyName: string;
};

/** Same rules as backend `phoneUtil.normalizePhone` */
export function normalizeUserPhone(raw: string): string {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (!d) return "";
  if (d.length >= 11 && d.startsWith("976")) {
    d = d.slice(3);
  }
  return d;
}

export class ApiAuthError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiAuthError";
    this.status = status;
  }
}

export async function registerUser(payload: {
  phone: string;
  password: string;
  email?: string;
  age?: string | number;
  accountType?: AccountType;
  companyName?: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch(apiUrl("/api/user/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      phone: normalizeUserPhone(payload.phone),
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    token?: string;
    user?: UserProfile;
  };
  if (!res.ok) {
    throw new ApiAuthError(
      res.status,
      data.error || "Бүртгэл амжилтгүй"
    );
  }
  return data as { token: string; user: UserProfile };
}

export async function loginUser(
  phone: string,
  password: string
): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch(apiUrl("/api/user/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: normalizeUserPhone(phone),
      password,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    token?: string;
    user?: UserProfile;
  };
  if (!res.ok) {
    throw new ApiAuthError(res.status, data.error || "Нэвтрэхэд алдаа");
  }
  return data as { token: string; user: UserProfile };
}

export async function fetchUserMe(): Promise<UserProfile> {
  const res = await fetch(apiUrl("/api/user/me"), {
    headers: userAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Алдаа");
  }
  const u = data as Partial<UserProfile> & { phone: string };
  return {
    phone: u.phone,
    email: u.email ?? "",
    age: u.age ?? null,
    accountType: u.accountType === "company" ? "company" : "individual",
    companyName: (u.companyName ?? "").trim(),
  };
}

export type Submission = {
  _id: string;
  receiptNumber?: string;
  totalAmount?: number | null;
  fullName?: string;
  phone: string;
  email?: string;
  productName?: string;
  productCount?: number;
  lotteryEntries?: number;
  receiptImage: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  userId?: string | null;
};

export type Winner = {
  _id: string;
  winnerName: string;
  phone: string;
  productName: string;
  prizeName: string;
  drawDate: string;
  submissionId?: string | null;
};

export type DrawPoolItem = {
  _id: string;
  fullName: string;
  phone: string;
  productName: string;
  productCount?: number;
  lotteryEntries?: number;
};

export async function fetchSubmissions(
  status?: string
): Promise<Submission[]> {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(apiUrl(`/api/submissions${q}`), {
    headers: adminAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchWinners(): Promise<Winner[]> {
  const res = await fetch(apiUrl("/api/winners"));
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteWinner(id: string) {
  const res = await fetch(apiUrl(`/api/winners/${id}`), {
    method: "DELETE",
    headers: adminAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Устгахад алдаа");
  }
}

export async function updateSubmissionStatus(
  id: string,
  status: Submission["status"]
) {
  const res = await fetch(apiUrl(`/api/submissions/${id}/status`), {
    method: "PATCH",
    headers: adminAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function patchSubmission(
  id: string,
  body: Partial<{
    status: Submission["status"];
    lotteryEntries: number;
    productCount: number;
  }>
) {
  const res = await fetch(apiUrl(`/api/submissions/${id}`), {
    method: "PATCH",
    headers: adminAuthHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Submission>;
}

export async function deleteSubmission(id: string) {
  const res = await fetch(apiUrl(`/api/submissions/${id}`), {
    method: "DELETE",
    headers: adminAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
}

export type PublicUser = {
  _id: string;
  phone: string;
  email: string;
  age: number | null;
  accountType?: AccountType;
  companyName?: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdminStats = {
  totalUsers: number;
  totalCompanies: number;
  totalIndividuals: number;
  registrationsByDay: { date: string; count: number }[];
  ageDistribution: { label: string; count: number }[];
};

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(apiUrl("/api/admin/stats"), {
    headers: adminAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchAdminUsers(
  accountType?: "individual" | "company"
): Promise<PublicUser[]> {
  const q =
    accountType && ["individual", "company"].includes(accountType)
      ? `?accountType=${encodeURIComponent(accountType)}`
      : "";
  const res = await fetch(apiUrl(`/api/admin/users${q}`), {
    headers: adminAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteAdminUser(id: string) {
  const res = await fetch(apiUrl(`/api/admin/users/${id}`), {
    method: "DELETE",
    headers: adminAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Устгахад алдаа");
  }
}

export async function loginAdmin(username: string, password: string) {
  const res = await fetch(apiUrl("/api/admin/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Алдаа");
  return data as { token: string; username: string };
}

/** Баталгаажсан цагийн завсар (серверийн DRAW_APPROVAL_TZ_OFFSET, өгөгдмөлөөр +08:00). */
export type ApprovalTimeFilter = {
  date: string;
  from: string;
  to: string;
};

export async function fetchDrawPool(
  approvalFilter?: ApprovalTimeFilter | null
): Promise<DrawPoolItem[]> {
  let path = "/api/draw/pool";
  if (approvalFilter?.date && approvalFilter?.from && approvalFilter?.to) {
    const q = new URLSearchParams({
      date: approvalFilter.date,
      from: approvalFilter.from,
      to: approvalFilter.to,
    });
    path = `${path}?${q.toString()}`;
  }
  const res = await fetch(apiUrl(path), {
    headers: adminAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchMySubmissions(): Promise<Submission[]> {
  const res = await fetch(apiUrl("/api/submissions/mine"), {
    headers: userAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Ачаалахад алдаа");
  }
  return data as Submission[];
}

export async function submitReceipt(formData: FormData) {
  const res = await fetch(apiUrl("/api/submissions"), {
    method: "POST",
    headers: userBearerHeaders(),
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Илгээхэд алдаа гарлаа");
  }
  return data as { message: string; submission: Submission };
}

export async function spinDraw(
  prizeName: string,
  submissionIds?: string[],
  approvalFilter?: ApprovalTimeFilter | null
) {
  const res = await fetch(apiUrl("/api/draw/spin"), {
    method: "POST",
    headers: adminAuthHeaders(),
    body: JSON.stringify({
      prizeName,
      submissionIds:
        submissionIds && submissionIds.length ? submissionIds : undefined,
      approvalFilter:
        approvalFilter?.date && approvalFilter?.from && approvalFilter?.to
          ? {
              date: approvalFilter.date,
              from: approvalFilter.from,
              to: approvalFilter.to,
            }
          : undefined,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Алдаа");
  }
  return data as Winner;
}
