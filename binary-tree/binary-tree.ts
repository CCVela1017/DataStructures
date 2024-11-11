import Node from "./tree-node";

export default class BinaryTree<T> {
  private __root: Node<T> | null;

  constructor(data: T) {
      this.__root = new Node(data);
  }

  insertLeft(data: T, ref: T): void {
      const node = this.__search(ref);
      if (node !== null) {
          const newNode = new Node(data);
          if (node.left === null) {
              node.left = newNode;
          } else {
              throw new Error("The left side isn't empty");
          }
      } else {
          throw new Error("The reference doesn't exist");
      }
  }

  insertRight(data: T, ref: T): void {
      const node = this.__search(ref);
      if (node !== null) {
          const newNode = new Node(data);
          if (node.right === null) {
              node.right = newNode;
          } else {
              throw new Error("The right side isn't empty");
          }
      } else {
          throw new Error("The reference doesn't exist");
      }
  }

  depth(ref: T, node: Node<T> | null = this.__root): number {
      if (node === null) {
          return -1;
      } else if (node.data === ref) {
          return 0;
      } else {
          const left = this.depth(ref, node.left);
          const right = this.depth(ref, node.right);
          if (left === -1 && right === -1) {
              return -1;
          } else {
              return Math.max(left, right) + 1;
          }
      }
  }

  private __search(ref: T, node: Node<T> | null = this.__root): Node<T> | null {
      if (node !== null) {
          if (node.data === ref) {
              return node;
          } else {
              let result = this.__search(ref, node.left);
              if (result === null) {
                  result = this.__search(ref, node.right);
              }
              return result;
          }
      } else {
          return null;
      }
  }

  height(node: Node<T> | null = this.__root): number {
      if (node === null) {
          return 0;
      } else {
          const altura = Math.max(this.height(node.left), this.height(node.right)) + 1;
          return altura;
      }
  }

  preorder(node: Node<T> | null = this.__root): void {
      if (node !== null) {
          console.log(node.data, ' '); 
          this.preorder(node.left);  
          this.preorder(node.right);
      }
  }

  inorder(node: Node<T> | null = this.__root): void {
      if (node !== null) {
          this.inorder(node.left);  
          console.log(node.data, ' ');  
          this.inorder(node.right);
      }
  }

  postorder(node: Node<T> | null = this.__root): void {
      if (node !== null) {
          this.postorder(node.left);
          this.postorder(node.right);
          console.log(node.data, ' ');
      }
  }
}
