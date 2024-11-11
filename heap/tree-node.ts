class TreeNode<T> {
  public data: T;
  public key: number;
  public left: TreeNode<T> | null;
  public right: TreeNode<T> | null;

  constructor(key: number, data: T) {
    this.data = data;
    this.key = key;
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
