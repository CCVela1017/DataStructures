import TreeNode from "./tree-node";

class Heap<T> {
  private root: TreeNode<T> | null;

  constructor(rootValue: number, rootData: T) {
    this.root = new TreeNode(rootValue, rootData);
  }

  public depth(value: number, subtree: TreeNode<T> | null = this.root): number {
    if (subtree === null) {
      return -1;
    } else if (subtree.key === value) {
      return 0;
    }

    const leftDepth = this.depth(value, subtree.left);
    const rightDepth = this.depth(value, subtree.right);

    if (leftDepth === -1 && rightDepth === -1) {
      return -1;
    }

    return Math.max(leftDepth, rightDepth) + 1;
  }

  public height(ref: TreeNode<T> | null = this.root): number {
    if (ref === null) {
      return 0;
    }

    return Math.max(this.height(ref.left), this.height(ref.right)) + 1;
  }

  public maxNodes(height: number) {
    let max = 0;
    for (let i = 0; i < height; i++){
      max += 2 ** i;
    }
    return max;
  }
  
  public preorder(ref: TreeNode<T> | null = this.root): string {
    if (ref === null) {
      return "";
    }

    if (ref.left === null && ref.right === null) {
      return ref.key.toString();
    }

    let result = `${ref.data} (`;
    result += `${this.preorder(ref.left)},`;
    result += `${this.preorder(ref.right)})`;

    return result;
  }

  public search(
    value: number,
    ref: TreeNode<T> | null = this.root
  ): TreeNode<T> | null {
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

  private swapUp(ref: TreeNode<T> | null, value: number, data: T): [number, T] | null {
    if (ref !== null) {
      let tempData = ref.data;
      let tempKey = ref.key;
      if (ref.key < value) {
        ref.key = value;
        ref.data = data;
        return [tempKey, tempData];
      }
      return [value, data];
    }
    return null;
  }

  private swapDown(ref: TreeNode<T> | null = this.root) {
    if (ref !== null) {
      if (!ref.isleaf()) {
        if (ref.left !== null && ref.right !== null) {
          const max = Math.max(ref.left.key, ref.right.key)
          if (ref.left.data === max) {
            if (ref.key < max) {
              const tempFather = ref.data;
              const temp = ref.left.data;
              const tempFatherKey = ref.key;
              const tempKey = ref.left.key;
              ref.key = tempKey;
              ref.left.key = tempFatherKey;

              ref.data = temp;
              ref.left.data = tempFather;
              this.swapDown(ref.left);
            }
          } else {
            if (ref.key < max) {
              const tempFather = ref.data;
              const temp = ref.right.data;
              const tempFatherKey = ref.key;
              const tempKey = ref.right.key;
              ref.key = tempKey;
              ref.right.key = tempFatherKey;
              ref.data = temp;
              ref.right.data = tempFather;
              this.swapDown(ref.right);
            }
          }
          return;
        } else {
          if (ref.key < ref.left!.key) {
            const tempFather = ref.data;
            const temp = ref.left!.data;
            const tempFatherKey = ref.key;
            const tempKey = ref.left!.key;
            ref.key = tempKey;
            ref.left!.key = tempFatherKey;
            ref.data = temp;
            ref.left!.data = tempFather;
            this.swapDown(ref.left);
          }
        }
        return;
      }
      return;
    }
  }

  private findRightMostNode(ref: TreeNode<T> | null): null | TreeNode<T> {
    if (ref !== null) {
      if (ref.isleaf()) {
        return ref;
      } else {
        if (ref.left !== null && ref.right !== null) {
          const leftHeight = this.height(ref.left);
          const rightHeight = this.height(ref.right);
          
          if (leftHeight === rightHeight) {
            return this.findRightMostNode(ref.right);
          } else if (leftHeight > rightHeight) {
            return this.findRightMostNode(ref.left);
        } 
      } else if (ref.right === null) {
        return ref.left;
      }
      }
    }
    return null;
  }
  
  public findParent(value: number,
    ref: TreeNode<T> | null = this.root): null | TreeNode<T> {
      if (ref?.isleaf()) {
        return null
      } else if (ref!.right === null && ref!.left!.key !== value) {
        return null;
      } else {
        if (ref !== null && ref.left!.key === value) {
          return ref;
  
        } else if (ref !== null && ref.right!.key === value) {
          return ref;
  
        } else if (ref !== null) {
          const leftResult = this.findParent(value, ref.left);
          if (leftResult === null) {
            const rightResult = this.findParent(value, ref.right);
            return rightResult;
          }
          return leftResult;
        }
        return null;
      }
      
  }

  public delete(): TreeNode<T> | null {
    if (this.root !== null) {
      if (this.root!.isleaf()) {
        const aux = this.root!;
        this.root = null;
        return aux;
      } else {
        const rootData = this.root.data;
        const rootKey = this.root.key;
        const copyRightNode = this.findRightMostNode(this.root);
      
        if (copyRightNode !== null) {
          let rightParent = this.findParent(copyRightNode?.key)
          if (rightParent!.left!.key === copyRightNode?.key) {
            rightParent!.left = null;
          } else {
            rightParent!.right = null;
          }
          this.root.data = copyRightNode?.data;
          this.root.key = copyRightNode?.key;
          this.swapDown();
        }
        
        return new TreeNode(rootKey, rootData);
      }

      
    } else return null; 
  }


 public insert(value: number, data: T, ref: TreeNode<T> | null = this.root) {
    if (this.root === null) {
      const newNode = new TreeNode(value, data);
      this.root = newNode;
      return;
    } else {
      let max = this.maxNodes(this.height());
      const swap = this.swapUp(ref, value, data)!;
      value = swap[0];
      data = swap[1];
      const newNode = new TreeNode(value, data);

      if (this.countNodes(this.root) === max) {
        if (ref?.isleaf()) {
          ref.left = newNode;
          return;
        } else { this.insert(value, data, ref?.left); }
      } else {
        this.__insert(value, data);
      }
    }

    
  }

  public __insert(value: number, data: T, ref: TreeNode<T>  | null = this.root){
    const swap = this.swapUp(ref, value, data)!;
      value = swap[0];
      data = swap[1];
    const newNode = new TreeNode(value, data);
    if (ref !== null) {
      const left = ref.left;
      const right = ref.right;
      const leftCant = this.countNodes(left);

      if (ref.hasChildren() === 1 || ref.isleaf()){
        
        if (left === null){
          ref.left = newNode;
        }
        else if (right === null){
          ref.right = newNode;
        } 
      }

      if (left !== null && right !== null){  
        let fullLeft = this.maxNodes(this.height() - this.depth(left.key));
        if (leftCant === fullLeft){
          this.__insert(value, data, ref.right);
        }
        else {
          this.__insert(value, data, ref.left);
        } 
      }
    }
  }

  countNodes(ref: TreeNode<T> | null = this.root): number {
    if (ref === null) {
      return 0;
    }

    return this.countNodes(ref.left) + this.countNodes(ref.right) + 1;
  }

}

export default Heap;
