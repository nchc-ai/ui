import React from 'react';
import Loading from './Loading';
import NoData from './NoData';

const DataFrameTable = ({ isLoading, data, children, className, cols }) => (
  <tbody className={`data-frame-comp ${className}`}>

    {/* Loading */}
    {
      isLoading ?
        <tr>
          <td colSpan={cols}>
            <Loading />
          </td>
        </tr>
      : null
    }

    {/* children */}
    {
      !isLoading && data.length > 0 ?
        children
      : null
    }

    {/* NoData */}
    {
      !isLoading && data.length === 0 ?
        <tr>
          <td colSpan={cols}>
            <NoData emptyWord={'目前沒有資料'} />
          </td>
        </tr>
      : null
    }
  </tbody>
);
export default DataFrameTable;
