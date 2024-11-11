export default class Node<T> {
  data: T;
  left: Node<T> | null = null;
  right: Node<T> | null = null;

  constructor(data: T) {
      this.data = data;
  }
}