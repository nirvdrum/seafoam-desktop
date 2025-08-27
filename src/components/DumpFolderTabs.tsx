import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import BgvFileList from "./BgvFileList";
import { DirectoryLoadedPayload, IPCEvents } from "../events";
import { Map } from "immutable";
import { createDumpFile } from "../lib/DumpFileUtils";
import { Card, Tabs } from "antd";
import { GraphsLoadedContext } from "../contexts/GraphsLoadedContext";

const EMPTY_TAB_NAME = "empty";

interface Props {
  methodFilter: string;
}

function buildTabs(loadedDumps: DumpDirectoryMap) {
  return Array.from(loadedDumps.keys()).map((directoryName) => {
    return {
      id: directoryName,
      content: directoryName.split("/").pop(),
    };
  });
}

export default function DumpFolderTabs(props: Props) {
  const { methodFilter } = props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [dumpDirectoryMap, setDumpDirectoryMap] = useState<DumpDirectoryMap>(
    Map([[EMPTY_TAB_NAME, []]])
  );
  const { setGraphsLoaded } = useContext(GraphsLoadedContext);

  useEffect(() => {
    window.ipc_events.subscribe(
      IPCEvents.DirectoryLoaded,
      (payload: DirectoryLoadedPayload) => {
        const files = payload.files.map((filename) =>
          createDumpFile(payload.directoryName, filename)
        );

        if (dumpDirectoryMap.has(EMPTY_TAB_NAME)) {
          setDumpDirectoryMap(Map([[payload.directoryName, files]]));
        } else {
          setDumpDirectoryMap(
            dumpDirectoryMap.set(payload.directoryName, files)
          );
        }

        setGraphsLoaded(true);
      }
    );

    return () => {
      window.ipc_events.unsubscribe(IPCEvents.DirectoryLoaded);
    };
  }, []);

  const handleTabChange = useCallback(
    (activeKey: string) => setSelectedTabIndex(parseInt(activeKey)),
    []
  );

  const tabs = buildTabs(dumpDirectoryMap);
  const tabId = tabs[selectedTabIndex]?.id;
  const listOfBgvFiles = dumpDirectoryMap.get(tabId) || [];

  const tabItems = tabs.map((tab, index) => ({
    key: index.toString(),
    label: tab.content,
    children: (
      <BgvFileList
        listOfBgvFiles={index === selectedTabIndex ? listOfBgvFiles : []}
        searchQuery={methodFilter}
      />
    ),
  }));

  return (
    <Card>
      <Tabs items={tabItems} onChange={handleTabChange} />
    </Card>
  );
}
