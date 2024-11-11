import TreeNode from "./tree-node";

export default class BinaryTree<T> {
  private root: TreeNode<T> | null = null;

  insert(value: T): void {
      const newNode = new TreeNode(value);
      if (this.root === null) {
          this.root = newNode;
      } else {
          this._insert(this.root, newNode);
      }
  }

  private _insert(node: TreeNode<T>, newNode: TreeNode<T>): void {
      if (newNode.value < node.value) {
          if (node.left === null) {
              node.left = newNode;
          } else {
              this._insert(node.left, newNode);
          }
      } else {
          if (node.right === null) {
              node.right = newNode;
          } else {
              this._insert(node.right, newNode);
          }
      }
  }

  public search(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
      if (node === null) return null;

      if (value < node.value) {
          return this.search(node.left, value);
      } else if (value > node.value) {
          return this.search(node.right, value);
      } else {
          return node; 
      }
  }

  delete(value: T): void {
      this.root = this._delete(this.root, value);
  }

  private _delete(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
      if (node === null) return null;

      if (value < node.value) {
          node.left = this._delete(node.left, value);
      } else if (value > node.value) {
          node.right = this._delete(node.right, value);
      } else {
          if (node.left === null && node.right === null) {
              return null;
          } else if (node.left === null) {
              return node.right;
          } else if (node.right === null) {
              return node.left;
          }

          const minRight = this.min(node.right);
          if (minRight) node.value = minRight.value;
          node.right = this._delete(node.right, node.value);
      }
      return node;
  }

  private min(node: TreeNode<T>): TreeNode<T> | null {
      let current = node;
      while (current && current.left !== null) {
          current = current.left;
      }
      return current;
  }


  public inorder(node: TreeNode<T> | null = this.root, result: T[]): void {
      if (node !== null) {
          this.inorder(node.left, result);
          result.push(node.value);
          this.inorder(node.right, result);
      }
  }

  public preorder(node: TreeNode<T> | null = this.root, result: T[]): void {
      if (node !== null) {
          result.push(node.value);
          this.preorder(node.left, result);
          this.preorder(node.right, result);
      }
  }

  public postorder(node: TreeNode<T> | null = this.root, result: T[]): void {
      if (node !== null) {
          this.postorder(node.left, result);
          this.postorder(node.right, result);
          result.push(node.value);
      }
  }
}
