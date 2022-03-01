import { Tree } from "../model/tree.model";

export const findAndUpdateTree = (trees: Tree[], targetTree: Tree): Tree[] => {
  let find = false;
  for (let i = 0; i < trees.length; i ++) {
    if (trees[i].id === targetTree.id) {
      find = true;
      trees[i] = targetTree;
    }
  }
  if (find) {
    return trees;
  } else {
    for (let tree of trees) {
      if (tree.children) {
        tree.children = findAndUpdateTree(tree.children, targetTree);
      }
    }
    return trees;
  }
}

export const findTreeById = (trees: Tree[], targetId: number): Tree | null => {
  let find = false;
  for (let i = 0; i < trees.length; i ++) {
    if (trees[i].id === targetId) {
      find = true;
      return trees[i];
    }
  }

  if (!find) {
    for (let tree of trees) {
      if (tree.children) {
        return findTreeById(tree.children, targetId);
      }
    }
  }

  return null;
}

export const findTreePathById = (trees: Tree[], targetId: number, pastPath: string[] = []): string[] => {
  let find = false;
  let paths: string[] = pastPath;
  for (let i = 0; i < trees.length; i ++) {
    if (trees[i].id === targetId) {
      find = true;
    }
  }

  if (!find) {
    for (let tree of trees) {
      if (tree.children) {
        paths.push(tree.name);
        const foundPath: string[] = findTreePathById(tree.children, targetId, paths);
        paths.concat(foundPath);
      }
    }
  }

  return paths;
}