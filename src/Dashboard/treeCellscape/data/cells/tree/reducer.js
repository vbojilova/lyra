/**
 * Reducer for trees
 */

import { combineReducers } from "redux";
import createReducer from "utils/createReducer.js";
import actions from "./types.js";

/**
 * rootID {string}
 * 	cell ID of the root node
 */

const initialTreeRootID = "";

const rootID = createReducer(initialTreeRootID)({
  [actions.fetchTreeRootSuccess]: (state, action) => action.root["cellID"]
});

/**
 * data {object}
 * 	data.key {string} - cell ID of node
 * 	data.value {object} - record of node
 */

const initialNodes = {};

const data = createReducer(initialNodes)({
  [actions.fetchTreeRootSuccess]: (state, action) => {
    const { children, ...otherRootProps } = action.root;

    return {
      ...state,
      [action.root["cellID"]]: otherRootProps
    };
  },
  [actions.fetchTreeNodesSuccess]: (state, action) => {
    const { treeNodes } = action;

    const treeNodeMap = processTreeNodes(treeNodes);

    return {
      ...state,
      ...treeNodeMap
    };
  },
  [actions.fetchAllTreeNodesSuccess]: (state, action) => ({
    ...state,
    ...processTreeNodes(action.treeNodes)
  })
});

const processTreeNodes = treeNodes =>
  treeNodes.reduce(
    (map, record) => ({
      ...map,
      [record["cellID"]]: record
    }),
    {}
  );

/**
 * pending {array}
 * 	all cellIDs that are currently being fetched
 */

const initialPending = [];
const pending = createReducer(initialPending)({
  [actions.fetchTreeNode]: (state, action) => [...state, action.nodeID],

  [actions.fetchTreeNodesSuccess]: (state, action) => [
    ...removeInOrder(state, action.nodeIDs)
  ]
});

/**
 * Remove all elements in list from state
 * ASSUME: lists are ordered in same way
 * @param {array} state
 * @param {array} list
 * @return {array}
 */
const removeInOrder = (state, list) => {
  if (list.length === 0) {
    return list;
  } else {
    const [firstList, ...restList] = list;
    const [firstState, ...restState] = state;

    return firstList === firstState
      ? [...removeInOrder(restState, restList)]
      : [firstState, ...removeInOrder(restState, list)];
  }
};

/**
 * Tree reducer
 * - treeRoot {string}
 * - nodes {object}
 */
const reducer = combineReducers({
  rootID,
  data,
  pending
});

/**
 * State Selectors
 */

const getTreeRootID = state => state.rootID;
const getTreeData = state => state.data;
const getTreePending = state => state.pending;

export const stateSelectors = {
  getTreeRootID,
  getTreeData,
  getTreePending
};

export default reducer;
