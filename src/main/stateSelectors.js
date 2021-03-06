import { stateSelectors } from "./reducer.js";

export const {
  // Analyses
  getSelectedAnalysisDashboard,
  getSelectedAnalysisID,
  getAnalysesData,
  getAnalysesOrder,

  //Dashboards
  getDashboards,

  // Dashboard
  getSelectedDashboard,
  getTreeCellscape,
  getSegsData,
  getSegsPending,
  getTreePath,
  getTreeData,
  getTreePending,
  getTreeRootID,
  getCellsIndexToID,
  getChromosomeData,
  getChromosomeOrder,
  getHighlightedIndex,
  getHighlightedRange,
  getHighlightedElement
} = stateSelectors;
