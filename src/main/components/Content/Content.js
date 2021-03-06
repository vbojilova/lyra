import React from "react";
import { connect } from "react-redux";
import { getSelectedAnalysisID, getSelectedAnalysisDashboard } from "./selectors.js";
import Dashboard from "Dashboard/Dashboard.js";

import styled from "react-emotion";

const Content = ({ selectedAnalysisID, selectedAnalysisDashboard }) =>
  selectedAnalysisID === null || selectedAnalysisDashboard === null ? null : (
    <ContentDiv>
      <Dashboard />
    </ContentDiv>
  );

const ContentDiv = styled("div")`
  width: 90%;
  margin-top: 5px;
  text-align: left;
  margin-left: 100px;
`;

const mapState = state => ({
  selectedAnalysisID: getSelectedAnalysisID(state),
  selectedAnalysisDashboard: getSelectedAnalysisDashboard(state)
});

export default connect(mapState)(Content);
