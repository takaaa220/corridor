import * as React from "react";

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FunctionComponent<LoadingProps> = props => {
  return props.isLoading ? (
    <div className="loading-container">
      <div id="loader">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  ) : null;
};

export default Loading;
