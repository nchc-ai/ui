import React from "react";
import loadingGIF from "../../../../public/images/common/loading.gif";

const Loading = () => (
  <div className="loading-comp">
    <span className="v-helper" />
    <img alt="" src={loadingGIF} />
  </div>
);

export default Loading;
