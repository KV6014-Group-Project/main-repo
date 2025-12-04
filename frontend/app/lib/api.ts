import { AuthUser, AuthRole, getAuthToken } from "./authState";

export const API_BASE_URL = "http://localhost:8000/api";

type AuthResponse = {
  user: AuthUser;
  token: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (data && typeof data === "object") {
      const messages: string[] = [];
      if (typeof (data as any).detail === "string") {
        messages.push((data as any).detail);
      }
      for (const key of Object.keys(data as any)) {
        const value = (data as any)[key];
        if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === "string") {
              messages.push(item);
            }
          }
        } else if (typeof value === "string") {
          messages.push(value);
        }
      }
      if (messages.length > 0) {
        throw new Error(messages.join("\n"));
      }
    }
    throw new Error("Request failed");
  }

  return data as T;
}

export type Role = AuthRole;

export async function fetchRoles(): Promise<Role[]> {
  return request<Role[]>("/users/roles/");
}

async function getRoleIdByName(roleName: "organiser" | "promoter"): Promise<string> {
  const roles = await fetchRoles();
  const role = roles.find((r) => r.name === roleName);
  if (!role) {
    throw new Error(`Role '${roleName}' is not configured on the server`);
  }
  return role.id;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/users/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(params: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  roleName: "organiser" | "promoter";
}): Promise<AuthResponse> {
  const roleId = await getRoleIdByName(params.roleName);

  const body = {
    email: params.email,
    password: params.password,
    role: roleId,
    first_name: params.first_name ?? "",
    last_name: params.last_name ?? "",
    phone: params.phone ?? "",
  };

  return request<AuthResponse>("/users/register/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function checkServerConnection(): Promise<boolean> {
  try {
    await request("/core/public-key/", { method: "GET" });
    return true;
  } catch (error) {
    return false;
  }
}
