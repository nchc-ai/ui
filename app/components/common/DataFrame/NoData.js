import React from "react";
import { IconContext, FaGhost } from "react-icons/fa";

const NoData = ({ emptyWord }) => (
  <div className="no-data-comp">
    <div className="no-data-container">
      <div className="icon-container">
        <FaGhost />
      </div>
      <h5 className="no-data-word">{emptyWord}</h5>
    </div>
  </div>
);

export default NoData;
