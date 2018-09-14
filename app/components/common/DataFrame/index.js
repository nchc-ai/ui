import React from 'react';
import _ from 'lodash';
import Loading from './Loading';
import NoData from './NoData';

const DataFrame = ({ isLoading, data, children, className }) => (
  <div className={`data-frame-comp ${className}`}>

    {/* Loading */}
    {
      isLoading ?
        <Loading />
      :
        null
    }

    {/* children */}
    {
      !isLoading && data.length > 0 && !_.isUndefined(data) ?
        children
      :
        null
    }

    {
      !isLoading && data.length === 0 ?
        <NoData emptyWord={'目前沒有資料'} />
      :
        null
    }
  </div>
);
export default DataFrame;
