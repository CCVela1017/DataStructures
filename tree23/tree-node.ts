import Data from "./data";

export default class TreeNode<T> {
  public data1: Data<T>;
  public data2: Data<T> | undefined;
  public left: TreeNode<T> | undefined;
  public middle: TreeNode<T> | undefined;
  public right: TreeNode<T> | undefined;

  constructor(data: Data<T>) {
    this.data1 = data;
  }

  public isFull() {
    return this.data2 !== undefined;
  }

  public getBranch(target: number) {
    if (target < this.data1.key) {
      return this.left;
    } else if (this.data2 === undefined) {
      return this.middle;
    } else if (this.data1.key < target && this.data2.key > target) {
      return this.middle;
    } else {
      return this.right;
    }
  }

  public isLeaf() {
    return (
      this.left === undefined && 
      this.right === undefined && 
      this.middle === undefined
    );
  }

  public contains(value: number) {
    if (!this.data2) {
      return this.data1.key === value
    }
    return this.data1.key === value || this.data2.key === value;
  }

  public insert(data: Data<T>) {
    if (this.data1.key < data.key) {
      this.data2 = {
        key: data.key,
        payload: data.payload,
      };
    } else {
      this.data2 = {
        key: this.data1.key,
        payload: this.data1.payload,
      }

      this.data1 = {
        key: data.key,
        payload: data.payload,
      }
    }
  }

  public remove(value: number): Data<T> | null{
    if (!this.contains(value)) {
      throw new Error();
    }

    if (this.data1.key === value && this.data2) {
      const value = this.data1;
      this.data1.key = this.data2.key
      this.data1.payload = this.data2.payload;
      this.data2 = undefined;
      return value;
    } else if (this.data2 && this.data2.key === value) {
      const value = this.data2;
      this.data2 = undefined;
      return value;
    }
    return null;
  }
}