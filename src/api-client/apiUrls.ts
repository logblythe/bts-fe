export const apiUrls = {
  auth: {
    login: "/auth/login",
  },
  users: {
    get: "/users",
    post: "/users",
    delete: "/users",
    changePassword: "/users/change-password",
    toggleAccess: (userId: string) => `/users/${userId}/toggle-access`,
    me: "/users/me",
  },
  events: {
    get: "/events",
    importEvent: "/events",
    getEventDefinitions: "/events/definition",
    deleteEventById: (eventId: string) => `/events/${eventId}`,
    updateConfig: (eventId: string) => `/events/${eventId}/update-config`,
  },
  msdynamicEvents: {
    get: "/msEvents",
    updateMemberCategory: "/msEvents/updateMemberCategory",
  },
  configs: {
    get: "/configs",
    post: "/configs",
    getById: (configId: string) => `/configs/${configId}`,
    deleteById: (configId: string) => `/configs/${configId}`,
    updateById: (configId: string) => `/configs/${configId}`,
  },
};
