import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import TableList from '../components/common/TableList/index';
import FormButtons from '../components/common/FormButtons/index';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent'
import { courseResultData } from '../constants/tableData';

const Comp = styled.div`
  padding: 50px 80px;
`;

const ListContainer = styled.div`
  padding: 30px 0px;
`;


class SearchPage extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
    this.fetchData(this.props);
  }

  fetchData = (nextProps) => {

    const {
      match,
      courseAction,
      token,
    } = nextProps;
    courseAction.searchCourse(match.params.queryString);
  }

  onBackButtonClick = () => {
    this.props.history.push('/');
  }
  render() {
    const {
      forms,
      match,
      searchResult
    } = this.props;

    return (
      <Comp>
        <CommonPageContent
          className="search-page-bg"
          pageTitle="課程搜尋結果"
        >
          <ListContainer>
            <TableList
              data={searchResult.data}
              tableData={courseResultData}
              isLoading={searchResult.isLoading}
              isLink
              isDialogOpen
              actionMode="none"
            />

            {/* 下方按鈕 */}
            <FormButtons
              cancelName="回到首頁"
              backMethod={this.onBackButtonClick}
              showMode="back_only"
              size={4}
              isForm
            />
          </ListContainer>
        </CommonPageContent>
      </Comp>
    );
  }
}

const mapStateToProps = ({ forms, Auth, Course }) => ({
  forms,
  token: Auth.token,
  userInfo: Auth.userInfo,
  searchResult: {
    isLoading: Course.searchResult.isLoading,
    data: Course.searchResult.data,
  }
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc,
  withRouter
)(SearchPage);
