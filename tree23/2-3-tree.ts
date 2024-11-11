import TreeNode from "./tree-node";
import Data from "./data";

export default class Tree23<T> {
  public root: TreeNode<T>;

  constructor(data: Data<T>) {
    this.root = new TreeNode(data);
  }


  private splitNode(ref: TreeNode<T>, data: Data<T>, 
    oldData: [TreeNode<T>, Data<T>, TreeNode<T>] | null): 
    [TreeNode<T>, Data<T>, TreeNode<T>] | null  {
    let leftKey: TreeNode<T>;
    let promotedKey: Data<T>;
    let middleKey: TreeNode<T>;
    if (data.key < ref.data1.key) {
      leftKey = new TreeNode(data);
      promotedKey = ref.data1;
      middleKey = new TreeNode(ref.data2!);

      if (oldData){
        leftKey.left = oldData[0]
        leftKey.middle = oldData[2]

        middleKey.left = ref.middle;
        middleKey.middle = ref.right;


      }

    } else if (ref.data2 && 
      data.key > ref.data1.key 
      && data.key <ref.data2.key) {
        leftKey = new TreeNode(ref.data1);
        promotedKey = data;
        middleKey = new TreeNode(ref.data2)
        
        if (oldData){
          leftKey.left = ref.left
          leftKey.middle = oldData[0]

          middleKey.left = oldData[2]
          middleKey.middle = ref.right
        }

      } else {
        leftKey = new TreeNode(ref.data1);
        promotedKey = ref.data2!;
        middleKey = new TreeNode(data);

        if (oldData){
          leftKey.left = ref.left
          leftKey.middle = ref.middle

          middleKey.left = oldData[0]
          middleKey.middle = oldData[2]
        }
      }
    if ( ref === this.root) {
      const newRoot = new TreeNode(promotedKey)
      newRoot.left = leftKey;
      newRoot.middle = middleKey;
      this.root = newRoot;
      return null
    }
    return [leftKey, promotedKey, middleKey];
  }
  
  public insert(data: Data<T>, ref: TreeNode<T> = this.root): 
  [TreeNode<T>, Data<T>, TreeNode<T>] | null {
    if (ref.isLeaf()) {
      if (ref.isFull() && ref.data2) {
        return this.splitNode(ref, data, null);
  
      } else {
        ref.insert(data);
        return null;
      }
    } else {
      const branch = ref.getBranch(data.key);
      const result = this.insert(data, branch);
      if (result) {
        if (ref.isFull()) {
  
          if (ref === this.root){
            if (result[1].key < ref.data1.key){
  
              const oldTree = this.root;
  
              this.root = new TreeNode(ref.data1);
              this.root.left = new TreeNode(result[1]);
              this.root.middle = new TreeNode(ref.data2!);
  
              this.root.left.left = result[0];
              this.root.left.middle = result[2];
  
              this.root.middle.left = oldTree.middle;
              this.root.middle.middle = oldTree.right;
  
  
            }
            else if (result[1].key > ref.data1.key && result[1].key < ref.data2!.key){
              const oldTree = this.root;
  
              this.root = new TreeNode(result[1]);
              this.root.left = new TreeNode(ref.data1);
              this.root.middle = new TreeNode(ref.data2!);
  
              this.root.left.left = oldTree.left;
              this.root.left.middle = result[0];
  
              this.root.middle.left = result[2];
              this.root.middle.middle = oldTree.right;
  
            }
            else{
              const oldTree = this.root;
  
              this.root = new TreeNode(ref.data2!);
              this.root.left = new TreeNode(ref.data1);
              this.root.middle = new TreeNode(result[1]);
  
              this.root.left.left = oldTree.left;
              this.root.left.middle = oldTree.middle;
  
              this.root.middle.left = result[0];
              this.root.middle.middle = result[2];
  
            }
          }
          else {
  
            return this.splitNode(ref, result[1], result);
          }
  
        } else {
  
          const promotedKey = result[1];
          if (promotedKey.key < ref.data1.key) {
            ref.insert(result[1]);
            const leftNode = result[0];
            const middleNode = result[2];
            const rightNode = ref.middle;
  
            ref.left = leftNode;
            ref.middle = middleNode;
            ref.right = rightNode;
          } else {
            ref.insert(promotedKey);
            ref.middle = result[0];
            ref.right = result[2];
          }
          
  
          return null;
        }
      }
      
    }
    return null;
   }


 public search(value: number, ref: TreeNode<T> = this.root): TreeNode<T> | null {
  if (ref.data1.key === value || ref.data2?.key === value) {
    return ref;
  } else if (ref.isLeaf()) {
    return null;
  } else {
    const branch = ref.getBranch(value)
    return this.search(value, branch);
  }
 }
 
 public searchByRange(min: number, max: number, 
  listOfValues: Array<T | undefined>, 
  ref: TreeNode<T> = this.root): Array<T | undefined> | null {

  if (!ref) {
    return null;
  }

  if (ref.data1.key <= max && ref.data1.key >= min) {
    listOfValues.push(ref.data1.payload);
  }

  if (ref.data2) {
    if (ref.data2.key <= max && ref.data2.key >= min) {
      listOfValues.push(ref.data2.payload);
    }
  }

  if (!ref.isLeaf()) {
    this.searchByRange(min, max, listOfValues, ref.left);
    this.searchByRange(min, max, listOfValues, ref.middle);
    this.searchByRange(min, max, listOfValues, ref.right);
  }

  return listOfValues;

 }

 public delete(value: number, ref: TreeNode<T> = this.root): Data<T> | null {
  if (!ref) {
    return null;
  }

  if (ref.contains(value)) {
    if (ref.isLeaf()) {
      if (ref.isFull()) {
        return ref.remove(value);
      } else {
        this._delete(value);

      }
    } else {

      const successor = this.min(ref.getBranch(value + 1));
      const newValue = successor.data1.key;
      if (ref.isFull()) {
        
        if (ref.data1.key === value) {
          const val = ref.data1;
          ref.data1.key = newValue;
          return val;

        } else if (ref.data2?.key === value) {
          const val = ref.data2;
          ref.data2.key = newValue;
          return val;
        }

      } else {
        const successor = this.min(ref.getBranch(value + 1));
        const newValue = successor.data1.key;
        const val = ref.data1;
        ref.data1.key = newValue;
        return val;
      }
      if (successor.isFull()) {
        successor.remove(newValue);
      } else {
        this._delete(newValue);
      }
    }

  } else {
    const branch = ref.getBranch(value);
    return this.delete(value, branch);
  }

  return null;
  
 }

 private _delete(value: number, ref: TreeNode<T> | null = this.root): TreeNode<T> | null {
  if (!ref) {
    throw new Error();
  }

  if (ref.isLeaf()) {
    if (ref.data1.key === value) { 
      
      return ref;
    } else {
      throw new Error();
    }
  }
  const branch = ref.getBranch(value);
  const val = this._delete(value, branch)
  if (val) {

    if (val === ref.left) {
      if (ref.middle) {
        if (ref.middle.isFull()) {
          if (ref.isFull()) {

            const promoted = ref.middle.data1.key
            ref.middle.remove(promoted);
            const newVal = ref.data1.key
            ref.left = new TreeNode({key: newVal})
            ref.data1.key = promoted
            return null
          }
        } else {
          if (ref.isFull()) {
           
            const down = ref.data1.key
            ref.remove(down)
            ref.left = new TreeNode({key: down})
            ref.left.insert(ref.middle.data1)
            ref.middle = ref.right;
            ref.right = undefined;
            return null;
          }
        }
      }
   
    } else if (val === ref.middle) {
      if (ref.left?.isFull()) {
        if (ref.isFull()) {
         
          const promoted = ref.left.data2!.key
          ref.left.remove(promoted);
          const newVal = ref.data2!.key
          ref.middle = new TreeNode({key: newVal})
          ref.data2!.key = promoted
          return null
        }
      } else if (ref.right?.isFull()) {
        if (ref.isFull()) {
       
          const promoted = ref.right.data1.key
          ref.right.remove(promoted);
          const newVal = ref.data1.key
          ref.middle = new TreeNode({key: newVal})
          ref.data1.key = promoted
          return null
        }
      } else {
        if (ref.isFull()) {
      
          const down = ref.data1.key
          ref.remove(down)
          ref.left = new TreeNode({key: down})
          ref.left.insert(ref.middle.data1)
          ref.middle = ref.right;
          ref.right = undefined;
          return null
        }
      }
      
    
   
    } else if (val === ref.right) {
      if (ref.middle) {
        if (ref.middle.isFull()) {
          if (ref.isFull()) {
           
            const promoted = ref.middle.data2!.key
            ref.middle.remove(promoted);
            const newVal = ref.data2!.key
            ref.right = new TreeNode({key: newVal})
            ref.data2!.key = promoted
            return null;
          }
        } else {
         
          if (ref.isFull()){
            const down = ref.data2!.key;
            ref.remove(down);
            ref.right = new TreeNode({key: down});
            ref.right.insert(ref.middle.data1);
            ref.middle = ref.right;
            ref.right = undefined;
            return null;
          }  
        }
      }
    }
    
  }
  return null;
 }

 private min(ref: TreeNode<T> | undefined): TreeNode<T> {
  if (!ref) {
    throw new Error();
  }

  if (!ref.isLeaf()) {
      return this.min(ref.left)
  } else {
    return ref;
  }
 }

 public inorder(ref: TreeNode<T> | null = this.root): string {
  if (ref === null){
    return "";
  }

  if (ref.data1 === undefined){
    return "Empty Tree";
  }

  if (ref.isLeaf()){
    if (ref.data2){
      return `${ref.data1} - ${ref.data2}`
    }
    else{
      return `${ref.data1}`
    }
  } else{
    let result = this.inorder(ref.left);
    result += ` - ${ref.data1} - `;
    result += ` ${this.inorder(ref.middle)}`;
    
    if (ref.data2){
      result += ` - ${ref.data2}`
      if (ref.right){
        result += ` - ${this.inorder(ref.right)}`;
      }
    }

    return result;

  }

  }
  public postorder(ref: TreeNode | null = this.root): string{
    if (ref === null){
      return "";
    }
  
    if (ref.data1 === undefined){
      return "Empty Tree";
    }
  
    if (ref.isLeaf()){
      if (ref.data2){
        return `${ref.data1} - ${ref.data2}`
      }
      else{
        return `${ref.data1}`
      }
    } else{
      let result = this.postorder(ref.left);
      result += ` - ${this.postorder(ref.middle)}`;
      
      if (ref.data2){
        if (ref.right){
          result += ` - ${this.postorder(ref.right)}`;
        }
  
        result += ` - ${ref.data2}`;
      }
  
      result += ` - ${ref.data1}`;
  
      return result;
  
    }
  
  }
  
  public preorder(ref: TreeNode | null = this.root): string {
    if (ref === null) {
      return "";
    }
  
    if (ref.data1 === undefined) {
      return "Empty Tree";
    }
  
    let result = `${ref.data1}`; 
  
    if (ref.isLeaf()) {
      if (ref.data2) {
        result += ` - ${ref.data2}`; 
      }
    } else {
      result += ` - ${this.preorder(ref.left)}`; 
      result += ` - ${this.preorder(ref.middle)}`; 
      
      if (ref.data2) {
        if (ref.right) {
          result += ` - ${this.preorder(ref.right)}`; 
        }
        result += ` - ${ref.data2}`; 
      }
    }
  
    return result;
  }
  

  public hasOne(): boolean {
    return this.root.isLeaf() && !this.root.isFull();
  }
}