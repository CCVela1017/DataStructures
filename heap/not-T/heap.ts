import TreeNode from "./tree-node";

export default class Heap {
  public root: TreeNode | null;

  constructor(rootValue: number) {
    this.root = new TreeNode(rootValue);
  }

  public depth(value: number, subtree: TreeNode | null = this.root): number {
    if (subtree === null) {
      return -1;
    } else if (subtree.data === value) {
      return 0;
    }

    const leftDepth = this.depth(value, subtree.left);
    const rightDepth = this.depth(value, subtree.right);

    if (leftDepth === -1 && rightDepth === -1) {
      return -1;
    }

    return Math.max(leftDepth, rightDepth) + 1;
  }

  public height(ref: TreeNode | null = this.root): number {
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

  private swapUp(ref: TreeNode | null, value: number): number | null{
    if (ref !== null) {
      let temp = ref.data;
      if (ref.data < value) {
        ref.data = value;
        return temp;
      }
      return value;
    }
    return null;
  }

  private swapDown(ref: TreeNode | null = this.root) {
    if (ref !== null) {
      if (!ref.isleaf()) {
        if (ref.left !== null && ref.right !== null) {
          const max = Math.max(ref.left.data, ref.right.data)
          if (ref.left.data === max) {
            if (ref.data < max) {
              const tempFather = ref.data;
              const temp = ref.left.data;
              ref.data = temp;
              ref.left.data = tempFather;
              this.swapDown(ref.left);
            }
          } else {
            if (ref.data < max) {
              const tempFather = ref.data;
              const temp = ref.right.data;
              ref.data = temp;
              ref.right.data = tempFather;
              this.swapDown(ref.right);
            }
          }
          return;
        } else {
          if (ref.data < ref.left!.data) {
            const tempFather = ref.data;
            const temp = ref.left!.data;
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

  private findRightMostNode(ref: TreeNode | null): null | TreeNode {
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
    ref: TreeNode | null = this.root): null | TreeNode {
      if (ref?.isleaf()) {
        return null
      } else if (ref!.right === null && ref!.left!.data !== value) {
        return null;
      } else {
        if (ref !== null && ref.left!.data === value) {
          return ref;
  
        } else if (ref !== null && ref.right!.data === value) {
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

  public delete(): number | null{
    if (this.root !== null) {
      if (this.root!.isleaf()) {
        const aux = this.root!.data;
        this.root = null;
        return aux;
      } else {
        const root = this.root.data;
        const copyRightNode = this.findRightMostNode(this.root);
      
        if (copyRightNode !== null) {
          let rightParent = this.findParent(copyRightNode?.data)
          if (rightParent!.left!.data === copyRightNode?.data) {
            rightParent!.left = null;
          } else {
            rightParent!.right = null;
          }
          this.root.data = copyRightNode?.data;
          this.swapDown();
        }
        
        return root!;
      }

      
    } else return null; 
  }

  public insert(value: number, ref: TreeNode | null = this.root) {
    if (this.root === null) {
      const newNode = new TreeNode(value);
      this.root = newNode;
      return;
    } else {
      let max = this.maxNodes(this.height());
      value = this.swapUp(ref, value)!;
      const newNode = new TreeNode(value);

      if (this.countNodes(this.root) === max) {
        if (ref?.isleaf()) {
          ref.left = newNode;
          return;
        } else { this.insert(value, ref?.left); }
      } else {
        this.__insert(value);
      }
    }

    
  }

  public __insert(value: number, ref: TreeNode | null = this.root){
    value = this.swapUp(ref, value)!;
    const newNode = new TreeNode(value);
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
        let fullLeft = this.maxNodes(this.height() - this.depth(left.data));
        if (leftCant === fullLeft){
          this.__insert(value, ref.right);
        }
        else {
          this.__insert(value, ref.left);
        } 
      }
    }
  }

  countNodes(ref: TreeNode | null = this.root): number {
    if (ref === null) {
      return 0;
    }

    return this.countNodes(ref.left) + this.countNodes(ref.right) + 1;
  }

}

