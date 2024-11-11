
class TreeNode {
  public data: number;
  public left: TreeNode | null;
  public right: TreeNode | null;

  constructor(data: number) {
    this.data = data;
    this.left = null;
    this.right = null;
  }

  hasChildren(): number {
    if (this.left !== null && this.right !== null) {
      return 2;
    } else if (this.left === null || this.right === null) {
      return 1;
    } else { return 0; }
  }

  isleaf(): boolean {
    return this.left === null && this.right === null;
  }
}

export default TreeNode;
