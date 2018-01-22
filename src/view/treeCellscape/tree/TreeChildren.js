/**
* TreeChildren -  React Component
*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


import { makeGetTreeChildrenSummary, getTreeYScale, getOffsetIndex } from 'state/selectors/treeCellscape.js'
import { addChildrenSummary } from 'state/actions/treeCellscape.js'

import TreeNode from './TreeNode'
import TreeChildrenCluster from './TreeChildrenCluster'
import TreeVerticalBranch from './TreeVerticalBranch'

class TreeChildren extends Component {
	static propTypes = {
		/** childrenSummary - list of clusters and nodes*/
		childrenSummary: PropTypes.arrayOf(PropTypes.object).isRequired,

		/** depth - current depth of children*/
		depth: PropTypes.number.isRequired,

		/** parentIndex - heatmap index of parent of children*/
		parentIndex: PropTypes.number.isRequired,

	  	/** yScale*/
		yScale: PropTypes.func.isRequired,


		/** offsetIndex - number of indices to offset clusters by*/
		offsetIndex: PropTypes.number.isRequired

	}

	componentDidMount() {
		const { dispatch, childrenSummary } = this.props
		dispatch(addChildrenSummary(childrenSummary))
	}





	render() {
		const { childrenSummary, depth, parentIndex, yScale, offsetIndex } = this.props

		let maxIndex = parentIndex

		const childrenJSX = childrenSummary.map((childAgg) => {
			if (childAgg.hasOwnProperty('cellID')) {
				maxIndex = Math.max(maxIndex, childAgg['heatmapIndex'])
				return drawTreeNode(childAgg, depth)
			}
			else {
				const maxClusterIndex = getMaxClusterIndex(childAgg, offsetIndex)

				maxIndex = Math.max(maxIndex, maxClusterIndex)

				return drawTreeCluster(childAgg, maxClusterIndex, depth, yScale)
			}

		})

		const verticalBranch = drawTreeVerticalBranch(parentIndex, maxIndex, depth, yScale)

		return (<g>
					{verticalBranch}
					{childrenJSX}
				</g>)
	}

}



/**
* Returns the end of the cluster index (with offset, or original if it's too small)
* @param {object} clusterDimensions
* @param {int} offsetIndex
* @return {int}
*/
const getMaxClusterIndex = (clusterDimensions, offsetIndex) => {
	const { startIndex, endIndex } = clusterDimensions
	const indexDistance = endIndex - startIndex

	return indexDistance - offsetIndex < 0 ? endIndex : endIndex - offsetIndex
}



/**
* Drawing modules
*/


/**
* Returns JSX for a cluster
* @param {object} clusterDimensions
* @param {int} depth - current
* @param {func} yScale
* @param {int} clusterIndex - index where cluster point should touch branch
* @return {JSX}
*/
const drawTreeCluster = (clusterDimensions, maxClusterIndex, depth, yScale) => (
	<TreeChildrenCluster key={clusterDimensions.startIndex} 
						minIndex={clusterDimensions.startIndex} 
						maxIndex={clusterDimensions.endIndex}
						maxIndexWithOffset={maxClusterIndex} 
						depth={depth} 
						yScale={yScale} 
						maxHeight={clusterDimensions.maxHeight} 
	/>
)


/**
* Return JSX for tree node
* @param {object} currNode
* @param {int} depth
* @return {JSX}
*/
const drawTreeNode = (currNode, depth) => (
	<TreeNode key={currNode['heatmapIndex']} nodeID={currNode['cellID']} depth={depth}/>
)


/**
* Return JSX for connecting vertical branch
* @param {int} minIndex
* @param {int} maxIndex
* @param {int} depth
* @param {func} yScale
* @return {JSX}
*/
const drawTreeVerticalBranch = (minIndex, maxIndex, depth, yScale) => (
	<TreeVerticalBranch minIndex={minIndex} maxIndex={maxIndex} depth={depth - 1} yScale={yScale}/>
)







/**
* MapState Factory function for Tree Children (use of Reselect)
* @return {func} mapState
*/
const makeMapState = () => {
	const getTreeChildrenSummary = makeGetTreeChildrenSummary()
	const mapState = (state, ownProps) => ({
		childrenSummary: getTreeChildrenSummary(state, ownProps.children),
		yScale: getTreeYScale(state),
		offsetIndex: getOffsetIndex(state)
	})
	return mapState
}


export default connect(makeMapState)(TreeChildren)