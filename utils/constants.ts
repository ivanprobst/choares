export const GENERIC = {
  recurringTimeframe: 365,
};

export const ENDPOINTS = {
  tasks: "/api/tasks",
  groups: "/api/groups",
  subMembers: "members",
};

export const ROUTES = {
  home: "/",
  signin: "/signin",
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
};
