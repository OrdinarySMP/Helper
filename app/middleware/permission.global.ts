type PermissionMeta = {
  permission: string;
  fallback?: string;
};

export default defineNuxtRouteMiddleware(async (to) => {
  const permission = to.meta.permission as PermissionMeta | undefined;
  if (!permission) {
    return;
  }

  if (!hasPermissionTo(permission.permission)) {
    return navigateTo(permission.fallback ?? "/");
  }
});
