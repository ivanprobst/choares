import React, { Dispatch } from "react";

// TODO: store the group name as well, to display it clean without DB fetch?
const GroupContext = React.createContext<{
  currentGroupId: string | null;
  setCurrentGroupId: Dispatch<string | null> | null;
}>({
  currentGroupId: null,
  setCurrentGroupId: null,
});

export default GroupContext;
