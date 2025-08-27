import * as React from "react";
import * as ReactDOM from "react-dom/client";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GraphsLoadedProvider } from "./contexts/GraphsLoadedContext";
import { GraphDataSourceProvider } from "./contexts/GraphDataSourceContext";

const styles = {
  app: {
    flexGrow: 1,
    height: "100vh",
    flexDirection: "row",
  },
  box: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  left: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    overflow: "scroll",
    height: "100vh",
    width: "30vw",
  },
  right: {
    flexGrow: 2,
    height: "100vh",
  },
};

const root = ReactDOM.createRoot(document.querySelector("#app")!);

function App() {
  return (
    <div style={styles.app as React.CSSProperties}>
      <ErrorBoundary>
        <GraphsLoadedProvider>
          <GraphDataSourceProvider>
            <div style={styles.box as React.CSSProperties}>
              <div style={styles.left as React.CSSProperties}>
                <LeftPanel />
              </div>
              <div style={styles.right as React.CSSProperties}>
                <RightPanel />
              </div>
            </div>
          </GraphDataSourceProvider>
        </GraphsLoadedProvider>
      </ErrorBoundary>
    </div>
  );
}

// The App is tentatively split into two "sections". This is achieved by using two full-height divs, and using CSS flex
// to create a 2:1 ratio between the right and left panel.

root.render(<App />);
