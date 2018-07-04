import React from 'react';
import Loading from './Loading';
import NoData from './NoData';

const DataFrame = ({ isLoading, data, children, className }) => (
  <div className={`data-frame-comp ${className}`}>
    {
      isLoading ?
        <Loading />
      :
        <div>
          {
            data.length > 0 ?
              <div>
                { children }
              </div>
            :
              <NoData emptyWord={'目前沒有資料'} />
          }
        </div>
    }
  </div>
);
export default DataFrame;
