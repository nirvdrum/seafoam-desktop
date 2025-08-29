import * as React from "react";

import DumpFolderTabs from "./DumpFolderTabs";
import SearchMethodTextField from "./SearchMethodTextField";
import { useState } from "react";
import { Card } from "antd";

const LeftPanel: React.FunctionComponent = () => {
  const [query, setQuery] = useState("");
  const methodFilter = (query: string) => {
    setQuery(query);
  };

  return (
    <Card
      title="Graal Dump Folders"
      style={{ height: "100%", overflow: "auto" }}
    >
      <SearchMethodTextField methodFilter={methodFilter} />
      <br />
      <DumpFolderTabs methodFilter={query} />
    </Card>
  );
};

export default LeftPanel;
