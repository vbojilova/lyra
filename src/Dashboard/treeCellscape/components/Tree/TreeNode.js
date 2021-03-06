/**
 * TreeNode -  React Component
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { makeGetTreeNodeRecordByID, getYScale } from "./selectors.js";
import { fetchTreeNode } from "./actions.js";

import DataFetcher from "utils/DataFetcher";

import TreeNodePoint from "./TreeNode/TreeNodePoint";
import TreeChildren from "./TreeChildren";
import TreeHorizontalBranch from "./TreeBranch/TreeHorizontalBranch";

/**
 * Tree Node Data Fetcher
 */

const isDataMissing = props => {
  const { treeNode } = props;
  return treeNode === null;
};

const fetchData = props => {
  const { nodeID } = props;
  return fetchTreeNode(nodeID);
};

/**
 * Factory function for mapstate to Tree Node
 */
const makeMapStateForTreeNode = () => {
  const getTreeNodeRecordByID = makeGetTreeNodeRecordByID();
  const mapState = (state, ownProps) => ({
    treeNode: getTreeNodeRecordByID(state, ownProps.nodeID),
    yScale: getYScale(state)
  });
  return mapState;
};

const TreeNodeFetcher = connect(makeMapStateForTreeNode())(DataFetcher);

const TreeNode = ({ nodeID, depth, siblingIndex, offsetBy, isRoot }) => {
  /**
   * render prop
   * @param {object} nodeData
   * @param {func} yScale
   */

  const render = props => {
    const { treeNode, yScale } = props;
    const { heatmapIndex, children, parent, maxDescendantIndex } = treeNode;
    const branch =
      parent === "root" ? (
        ""
      ) : (
        <TreeHorizontalBranch
          heatmapIndex={heatmapIndex - offsetBy}
          depth={depth}
          yScale={yScale}
        />
      );

    return (
      <g>
        {branch}
        <TreeNodePoint
          nodeID={nodeID}
          heatmapIndex={heatmapIndex}
          maxDescendantIndex={maxDescendantIndex}
          depth={depth}
          yScale={yScale}
          offsetBy={offsetBy}
          isRoot={isRoot}
        />
        <TreeChildren
          children={children}
          depth={depth + 1}
          parentIndex={heatmapIndex - offsetBy}
          auntIndex={siblingIndex}
          offsetBy={offsetBy}
        />
      </g>
    );
  };
  return (
    <TreeNodeFetcher
      render={render}
      nodeID={nodeID}
      fetchData={fetchData}
      isDataMissing={isDataMissing}
    />
  );
};
TreeNode.defaultProps = {
  depth: 0,
  offsetBy: 0,
  isRoot: false
};

/**
 * PropTypes
 */
TreeNode.propTypes = {
  /** nodeID*/
  nodeID: PropTypes.string.isRequired,

  /** depth - current depth of node from root */
  depth: PropTypes.number.isRequired,

  /** siblingIndex - offsetted heatmap index of adjacent sibling */
  siblingIndex: PropTypes.number,

  /** offsetBy - number of indices to offset drawing by */
  offsetBy: PropTypes.number.isRequired
};

export default TreeNode;
