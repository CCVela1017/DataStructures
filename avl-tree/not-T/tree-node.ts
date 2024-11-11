class TreeNode {
  public data: number;
  public left: TreeNode | null;
  public right: TreeNode | null;

  constructor(data: number) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
  
  isLeaf(): boolean {
    return this.left === null && this.right === null;
  }
}


export default TreeNode;
