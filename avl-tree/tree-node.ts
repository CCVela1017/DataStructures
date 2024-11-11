class TreeNode<T> {
  public data: T;
  public key: number;
  public left: TreeNode<T> | null;
  public right: TreeNode<T> | null;

  constructor(key: number, data: T) {
    this.key = key;
    this.data = data;
    this.left = null;
    this.right = null;


  }
  
  isLeaf(): boolean {
    return this.left === null && this.right === null;
  }
}


export default TreeNode;
