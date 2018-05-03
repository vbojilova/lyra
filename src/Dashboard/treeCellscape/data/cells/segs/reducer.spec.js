import reducer from "./reducer.js";
import { fetchSegs, fetchSegsSuccess } from "./actions.js";
import data from "utils/testData.js";

describe("tree cellscape: data/cells/segs reducer", () => {
  const initialState = {
    data: {},
    pending: []
  };

  it("should return initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should handle TREECELLSCAPE_FETCH_SEGMENTS", () => {
    expect(reducer(initialState, fetchSegs([data.testNodeID]))).toEqual({
      data: initialState.data,
      pending: [data.testNodeID]
    });
  });

  it("should handle TREECELLSCAPE_FETCH_SEGMENTS_SUCCESS", () => {
    expect(
      reducer(
        initialState,
        fetchSegsSuccess([data.testSegs_02], [data.testNodeID_02])
      )
    ).toEqual({
      data: data.testTreeNode,
      pending: initialState.pending,
      rootID: data.testNodeID
    });
  });

  it("should handle unrelated actions", () => {
    expect(reducer(initialState, { type: "UNKNOWN" })).toEqual(initialState);
  });
});