export const GENERIC = {
  recurringTimeframe: 365,
};

export const ENDPOINTS = {
  tasks: "/api/tasks",
  groups: "/api/groups",
};

export const ROUTES = {
  home: "/",
  settings: "/settings",
  task: "/tasks",
  tasksList: "/tasks/list",
  tasksCreate: "/tasks/create",
  group: "/groups",
  groups: "/groups/list",
  groupsCreate: "/groups/create",
};

export const LOCAL_STORAGE = {
  groupId: "groupId",
};

export const ERROR_CODES = {
  noGroupDefined: "no_group_defined",
  unsupportedRequestMethod: "unsupported_request_method",
  sessionInvalid: "session_invalid",
  queryInvalid: "query_incorrect",
  dataFormatIncorrect: "data_format_incorrect",
  databaseUnkownError: "database_unknown_error",
  userNotFound: "user_not_found",
  taskNotFound: "task_not_found",
};
