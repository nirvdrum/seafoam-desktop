import * as React from "react";
import { useState } from "react";

import { Card, OptionList } from "@shopify/polaris";
import { SeafoamMethod } from "../types/RootFolder";

interface Props {
  listOfBgvFiles: SeafoamMethod[];
  setSelectedFile?: (method: SeafoamMethod) => void;
}

export default function BgvFileList(props: Props) {
  const { listOfBgvFiles, setSelectedFile } = props;
  const [selected, setSelected] = useState([]);

  const seafoamMethodMap = new Map(
    listOfBgvFiles.map((file) => [file.id, file])
  );

  const listOptions = listOfBgvFiles.map((bgvFile) => ({
    value: bgvFile.id,
    label: bgvFile.name,
  }));

  return (
    <Card>
      <OptionList
        title="List of Bgv Files"
        onChange={(selected) => {
          if (selected.length === 1) {
            setSelected(selected);
            setSelectedFile(seafoamMethodMap.get(selected[0]));
          } else {
            throw "Too many selected files";
          }
        }}
        options={listOptions}
        selected={selected}
      />
    </Card>
  );
}
