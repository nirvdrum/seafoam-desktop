import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import BgvFileList from "./BgvFileList";
import { DirectoryLoadedPayload, IPCEvents } from "../events";
import { Map } from "immutable";
import { createDumpFile } from "../lib/DumpFileUtils";
import { Card, Tabs } from "antd";
import { GraphsLoadedContext } from "../contexts/GraphsLoadedContext";

interface Props {
  methodFilter: string;
}

function buildTabs(loadedDumps: DumpDirectoryMap) {
  return Array.from(loadedDumps.keys()).map((directoryName) => {
    return {
      id: directoryName,
      content: directoryName.split("/").pop() || directoryName,
    };
  });
}

export default function DumpFolderTabs(props: Props) {
  const { methodFilter } = props;
  const [activeKey, setActiveKey] = useState<string>("");
  const [dumpDirectoryMap, setDumpDirectoryMap] = useState<DumpDirectoryMap>(
    Map()
  );
  const { setGraphsLoaded } = useContext(GraphsLoadedContext);

  useEffect(() => {
    const handleDirectoryLoaded = (payload: DirectoryLoadedPayload) => {
      const files = payload.files.map((filename) =>
        createDumpFile(payload.directoryName, filename)
      );

      // Create a unique key for this tab
      const tabKey = `${payload.directoryName}_${Date.now()}`;

      setDumpDirectoryMap((prevMap) => prevMap.set(tabKey, files));

      // Set this as the active tab
      setActiveKey(tabKey);
      setGraphsLoaded(true);
    };

    window.ipc_events.subscribe(
      IPCEvents.DirectoryLoaded,
      handleDirectoryLoaded
    );

    return () => {
      window.ipc_events.unsubscribe(IPCEvents.DirectoryLoaded);
    };
  }, [setGraphsLoaded]);

  const handleTabChange = useCallback((newActiveKey: string) => {
    setActiveKey(newActiveKey);
  }, []);

  const handleTabEdit = useCallback(
    (
      targetKey: React.MouseEvent | React.KeyboardEvent | string,
      action: "add" | "remove"
    ) => {
      if (action === "remove" && typeof targetKey === "string") {
        setDumpDirectoryMap((prevMap) => {
          const newMap = prevMap.delete(targetKey);

          // If we're closing the active tab, switch to another tab
          if (targetKey === activeKey) {
            const remainingKeys = Array.from(newMap.keys());
            if (remainingKeys.length > 0) {
              // Switch to the last tab
              setActiveKey(remainingKeys[remainingKeys.length - 1]);
            } else {
              setActiveKey("");
            }
          }

          // Update graphs loaded state if no tabs remain
          if (newMap.size === 0) {
            setGraphsLoaded(false);
          }

          return newMap;
        });
      }
    },
    [activeKey, setGraphsLoaded]
  );

  const tabs = buildTabs(dumpDirectoryMap);
  const listOfBgvFiles = dumpDirectoryMap.get(activeKey) || [];

  const tabItems = tabs.map((tab) => ({
    key: tab.id,
    label: <span title={tab.id.split("_")[0]}>{tab.content}</span>,
    closable: true,
    children: (
      <BgvFileList
        listOfBgvFiles={tab.id === activeKey ? listOfBgvFiles : []}
        searchQuery={methodFilter}
      />
    ),
  }));

  return (
    <Card style={{ overflow: "hidden" }}>
      <Tabs
        type="editable-card"
        hideAdd
        items={tabItems}
        activeKey={activeKey}
        onChange={handleTabChange}
        onEdit={handleTabEdit}
        tabBarStyle={{
          marginBottom: 0,
          overflow: "auto",
          whiteSpace: "nowrap",
        }}
      />
    </Card>
  );
}
