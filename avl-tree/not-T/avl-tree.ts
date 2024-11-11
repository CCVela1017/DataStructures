import TreeNode from "./tree-node";

class AvlTree {
  private root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  public depth(value: number, ref: TreeNode | null = this.root): number {
    if (ref === null) {
      return -1;
    } else if (ref.data === value) {
      return 0;
    }

    const leftDepth = this.depth(value, ref.left);
    const rightDepth = this.depth(value, ref.right);

    if (leftDepth === -1 && rightDepth === -1) { 
      return -1;
    }

    return Math.max(leftDepth, rightDepth) + 1;
  }

  public height(ref: TreeNode | null = null): number {
    if (ref === null) {
      return 0;
    }

    return Math.max(this.height(ref.left), this.height(ref.right)) + 1;
  }

  private rotate(subtree: TreeNode | null) {
    if (!subtree) {
      throw new Error();
    }
    const balance = this.balanceFactor(subtree);

    if (balance === 0 || balance === -1 || balance === 1){
      return;
    }
    if (balance === 2) {
      const child = subtree.left;
      const childBalance = this.balanceFactor(child!);
      if (childBalance === 1 || childBalance === 0) {
        this.rotateRight(subtree);
        return;
      } else if ( childBalance === -1 ) {
        this.rotateDoubleRight(subtree);
        return;
      }
    } else if (balance === -2) {
      const child = subtree.right;
      const childBalance = this.balanceFactor(child!);
      if (childBalance === -1 || childBalance === 0) {
        this.rotateLeft(subtree);
        return;
      } else if ( childBalance === 1 ) {
        this.rotateDoubleLeft(subtree);
        return;
      }
    }
  }

  private balance(value: number, subtree: TreeNode | null = this.root) {
    if (subtree === null) {
      throw new Error();
    }

    if (subtree.isLeaf()) {
      if (subtree.data === value) { 
        return;
      } else {
        throw new Error();
      }
    } 
    
    if (value < subtree.data) {
      this.balance(value, subtree.left);
      this.rotate(subtree)!;
   
    } else {
      this.balance(value, subtree.right);
      this.rotate(subtree)!;
  
    }
    
  }

  private rotateLeft(subtree: TreeNode) {
    const parentData = subtree.data;
    const child = subtree.right;
    if (child === null) {
      throw new Error();
    }
    
    const grandChild = child.right;
    if (grandChild === null) {
      throw new Error();
    }

    const middleChild = child.left;
    const parentLeftChild = subtree.left;

    const newNode = child;
    newNode.left = new TreeNode(parentData);
    newNode.right = grandChild;
    newNode.left.right = middleChild;
    newNode.left.left = parentLeftChild;

    subtree.data = newNode.data;
    subtree.left = newNode.left;
    subtree.right = newNode.right;
  }

  private rotateRight(subtree: TreeNode) {
    if (!subtree) {
      throw new Error();
    }
    const parentData = subtree.data;
    const child = subtree.left;
    if (child === null) {
      throw new Error();
    }
    
    const grandChild = child.left;
    if (grandChild === null) {
      throw new Error();
    }

    const parentRightChild = subtree.right;
    const middleChild = child.right;

    const newNode = child;
    newNode.left = grandChild;
    newNode.right = new TreeNode(parentData);
    newNode.right.right = parentRightChild;
    newNode.right.left = middleChild;
    subtree.data = newNode.data;
    subtree.left = newNode.left;
    subtree.right = newNode.right;
  }

  private rotateDoubleRight(subtree: TreeNode) {
    if (!subtree) {
      throw new Error();
    }
    const parent = subtree;
    const child = subtree.left;
    if (!child) {
      throw new Error();
    }
    const grandChild = child.right;
    if (!grandChild) {
      throw new Error();
    }
    const a2 = grandChild.left;

    child.right = null;

    const newNode = parent;
    newNode.left = grandChild;
    newNode.left.left = child;
    newNode.left.left.right = a2;
    this.rotateRight(newNode);
    subtree.data = newNode.data;
    subtree.left = newNode.left;
    subtree.right = newNode.right;
  }

  private rotateDoubleLeft(subtree: TreeNode) {
    if (!subtree) {
      throw new Error();
    }
    const parent = subtree;
    const child = parent.right;
    if (!child) {
      throw new Error();
    }

    const grandChild = child.left;
    if (!grandChild) {
      throw new Error();
    }
    const a3 = grandChild.right;

    child.left = null;
    var newNode = parent;
    newNode.right = grandChild;
    newNode.right.right = child;
    newNode.right.right.left = a3;
    this.rotateLeft(newNode);
    subtree.data = newNode.data;
    subtree.left = newNode.left;
    subtree.right = newNode.right;
  }

  public insert(value: number, ref: TreeNode | null = this.root) {
    const newNode = new TreeNode(value);
    if (this.root === null) {
      this.root = newNode;
    }
    if (ref !== null) {
      if (value < ref.data) {
        if (ref.left === null) {
          ref.left = newNode;
          this.balance(value);
          
        } else {
          this.insert(value, ref.left)
        }   
      } else if (value > ref.data) {
        if (ref.right === null) {
          ref.right = newNode;
          this.balance(value);
          
        } else {
          this.insert(value, ref.right)
        }
      }
    }
    
  }

  private balanceFactor(ref: TreeNode): number {
    const leftHeight = this.height(ref.left);
    const rightHeight = this.height(ref.right);

    return leftHeight - rightHeight;
  }

  public min(ref: null | TreeNode = this.root): TreeNode | null{
    if (ref !== null) {
      if (ref.left === null) {
        return ref;
      }
      return this.min(ref.left)
    } else {
      throw new Error();
    }
  }

  public max(ref: null | TreeNode = this.root): TreeNode | null{
    if (ref !== null) {
      if (ref.right === null) {
        return ref;
      }
      return this.max(ref.right)
    } else {
      throw new Error();
    }
  }

  public preorder(ref: TreeNode | null = this.root): string {
    if (ref === null) {
      return "";
    }

    if (ref.left === null && ref.right === null) {
      return ref.data.toString();
    }

    let result = `${ref.data} (`;
    result += `${this.preorder(ref.left)},`;
    result += `${this.preorder(ref.right)})`;

    return result;
  }

  public search(
    value: number,
    ref: TreeNode | null = this.root
  ): TreeNode | null {
    if (ref !== null && ref.data === value) {
      return ref;
    } else if (ref !== null) {
      const leftResult = this.search(value, ref.left);

      if (leftResult === null) {
        const rightResult = this.search(value, ref.right);

        return rightResult;
      }

      return leftResult;
    }

    return null;
  }


  public delete(value: number, ref: TreeNode | null = this.root): TreeNode | null {
    if (!ref) return null;
    if (value < ref.data) {
      ref.left = this.delete(value, ref.left)
    } else if (value > ref.data) {
      ref.right = this.delete(value, ref.right)
    } else {
      if (!ref.left || !ref.right) {
        if (ref.left) {
          ref = ref.left;
        } else {
          ref = ref.right;
        }
      } else {
        const mostLeftRightNode = this.min(ref.right)!;
        ref.data = mostLeftRightNode.data
        ref.right = this.delete(mostLeftRightNode.data, ref.right)
      }
    }
    if (!ref) return ref;
    this.rotate(ref)
    return ref;
  }

  
}

export default AvlTree;
