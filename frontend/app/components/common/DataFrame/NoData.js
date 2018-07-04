import React from "react";

const NoData = ({ emptyWord }) => (
  <div className="no-data-comp">
    <div className="no-data-container">
      {/* <img alt="" className="empty-icon" src={obj.imgUrl} /> */}
      <span className="v-helper" />
      <h5 className="no-data-word">{emptyWord}</h5>
    </div>
  </div>
);

export default NoData;
