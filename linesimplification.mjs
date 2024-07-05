import {Vector} from "./vector.mjs";

export const lineSimplification = (sequence, epsilon = 10) => {

  const total = sequence.length;

  const simplifiedIdxs = [0, total - 1];

  const workList = [];
  workList.push(new WorkListItem(0, total - 1, 1));
  while (workList.length > 0) {
    const actItem = workList.splice(0, 1)[0];
    const furthestIdx = findFurthest(sequence, actItem.idx1, actItem.idx2, epsilon);
    if (furthestIdx < 0)
      continue;

    simplifiedIdxs.push(furthestIdx);

    // check if to go deeper
    // if (actItem.depth > 3)
    //   continue;

    workList.push(new WorkListItem(actItem.idx1, furthestIdx, actItem.depth + 1));
    workList.push(new WorkListItem(furthestIdx, actItem.idx2, actItem.depth + 1));
  }


  const simplifiedSequence = [];
  simplifiedIdxs.sort((a, b) => a - b);
  for (const simplifiedIdx of simplifiedIdxs) {
    simplifiedSequence.push(sequence[simplifiedIdx]);
  }
  return simplifiedSequence;
}

const lineDist = (vecC, vecA, vecB) => {
  const normalPointC = Vector.scalarProjection(vecC, vecA, vecB);
  return normalPointC.distance(vecC);
}

const findFurthest = (points, a, b, epsilon) => {
  let maxDistIdx = -1;

  if (b - a < 2)
    return maxDistIdx;

  let maxDist = -1;
  const start = points[a];
  const end = points[b];

  for (let i = a + 1; i <= b - 1; i++) {
    const point = points[i];
    const dist = lineDist(point, start, end);
    if (!isNaN(dist) && dist > maxDist) {
      maxDist = dist;
      maxDistIdx = i;
    }
  }

  if (maxDist < epsilon)
    return -1;

  return maxDistIdx;
}

class WorkListItem {
  constructor(idx1, idx2, depth) {
    this.idx1 = idx1;
    this.idx2 = idx2;
    this.depth = depth;
  }
}