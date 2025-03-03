// Định nghĩa các vai trò
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

// Định nghĩa các quyền hạn
export enum Permission {
  // Quyền về bài viết
  VIEW_POSTS = "VIEW_POSTS",
  CREATE_POST = "CREATE_POST",
  EDIT_POST = "EDIT_POST",
  DELETE_POST = "DELETE_POST",

  // Quyền về sản phẩm
  VIEW_PRODUCTS = "VIEW_PRODUCTS",
  CREATE_PRODUCT = "CREATE_PRODUCT",
  EDIT_PRODUCT = "EDIT_PRODUCT",
  DELETE_PRODUCT = "DELETE_PRODUCT",

  // Quyền về mua hàng
  PURCHASE_PRODUCTS = "PURCHASE_PRODUCTS",

  // Quyền quản trị hệ thống
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_SETTINGS = "MANAGE_SETTINGS",
}

// Định nghĩa quyền hạn cho mỗi vai trò
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // Admin có tất cả quyền
    Permission.VIEW_POSTS,
    Permission.CREATE_POST,
    Permission.EDIT_POST,
    Permission.DELETE_POST,

    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.DELETE_PRODUCT,

    Permission.PURCHASE_PRODUCTS,

    Permission.MANAGE_USERS,
    Permission.MANAGE_SETTINGS,
  ],
  [Role.USER]: [
    // User có thể xem và mua hàng
    Permission.VIEW_POSTS,
    Permission.VIEW_PRODUCTS,
    Permission.PURCHASE_PRODUCTS,
  ],
  [Role.GUEST]: [
    // Guest chỉ có thể xem
    Permission.VIEW_POSTS,
    Permission.VIEW_PRODUCTS,
  ],
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}
