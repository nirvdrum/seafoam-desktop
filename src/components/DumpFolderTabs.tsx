import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import BgvFileList from "./BgvFileList";
import { DirectoryLoadedPayload, IPCEvents } from "../events";
import { createDumpFile } from "../lib/DumpFileUtils";
import { Collapse, Space, Button, Typography, Divider } from "antd";
import { GraphsLoadedContext } from "../contexts/GraphsLoadedContext";
import { CloseOutlined, FolderOpenOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Text } = Typography;

interface Props {
  methodFilter: string;
}

interface DirectorySection {
  key: string;
  directoryPath: string;
  directoryName: string;
  files: DumpFile[];
}

export default function DumpFolderTabs(props: Props) {
  const { methodFilter } = props;
  const [dumpDirectories, setDumpDirectories] = useState<DirectorySection[]>(
    []
  );
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const { setGraphsLoaded } = useContext(GraphsLoadedContext);

  useEffect(() => {
    const handleDirectoryLoaded = (payload: DirectoryLoadedPayload) => {
      const files = payload.files.map((filename) =>
        createDumpFile(payload.directoryName, filename)
      );

      // Create a unique key for this directory section
      const sectionKey = `${payload.directoryName}_${Date.now()}`;
      const directoryName =
        payload.directoryName.split("/").pop() || payload.directoryName;

      const newSection: DirectorySection = {
        key: sectionKey,
        directoryPath: payload.directoryName,
        directoryName: directoryName,
        files: files,
      };

      setDumpDirectories((prev) => [...prev, newSection]);
      // Auto-expand the newly added directory
      setActiveKeys((prev) => [...prev, sectionKey]);
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

  const handleRemoveDirectory = useCallback(
    (sectionKey: string, event: React.MouseEvent) => {
      event.stopPropagation();

      setDumpDirectories((prev) => {
        const newDirectories = prev.filter((dir) => dir.key !== sectionKey);

        // Update graphs loaded state if no directories remain
        if (newDirectories.length === 0) {
          setGraphsLoaded(false);
        }

        return newDirectories;
      });

      // Remove from active keys if present
      setActiveKeys((prev) => prev.filter((key) => key !== sectionKey));
    },
    [setGraphsLoaded]
  );

  const handleCollapseChange = useCallback((keys: string | string[]) => {
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);
  }, []);

  if (dumpDirectories.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Text type="secondary">
          No dump directories loaded. Use File menu to open a BGV file or
          directory.
        </Text>
      </div>
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {dumpDirectories.map((directory, index) => (
        <div key={directory.key}>
          {index > 0 && <Divider style={{ margin: "12px 0" }} />}
          <Collapse
            activeKey={activeKeys}
            onChange={handleCollapseChange}
            expandIcon={({ isActive }) => (
              <FolderOpenOutlined rotate={isActive ? 0 : -90} />
            )}
            style={{
              background: "#fafafa",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
            }}
          >
            <Panel
              key={directory.key}
              header={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span title={directory.directoryPath}>
                    <strong>{directory.directoryName}</strong>
                    <Text
                      type="secondary"
                      style={{ marginLeft: "8px", fontSize: "12px" }}
                    >
                      ({directory.files.length} files)
                    </Text>
                  </span>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={(e) => handleRemoveDirectory(directory.key, e)}
                    style={{ marginLeft: "auto" }}
                  />
                </div>
              }
              style={{ marginBottom: 0 }}
            >
              <BgvFileList
                listOfBgvFiles={directory.files}
                searchQuery={methodFilter}
              />
            </Panel>
          </Collapse>
        </div>
      ))}
    </Space>
  );
}
