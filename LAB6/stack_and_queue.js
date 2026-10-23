// Stack Implementation using Fundamentals
// A Stack follows the LIFO (Last-In-First-Out) or FILO (First-In-Last-Out) principle.
class Stack {
    constructor() {
        this.items = []; // Array to store stack elements
    }

    // 1. push: Adds an element to the top of the stack
    push(element) {
        this.items.push(element);
        console.log(`${element} pushed to stack`);
    }

    // 2. pop: Removes and returns the top element of the stack (Last In, First Out)
    pop() {
        if (this.isEmpty()) {
            return "Stack is empty. Cannot pop.";
        }
        return this.items.pop();
    }

    // 3. peek: Returns the top element without removing it
    peek() {
        if (this.isEmpty()) {
            return "Stack is empty.";
        }
        return this.items[this.items.length - 1];
    }

    // 4. isEmpty: Checks if the stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // 5. size: Returns the number of elements in the stack
    size() {
        return this.items.length;
    }
}

// Queue Implementation using Fundamentals
// A Queue follows the FIFO (First-In-First-Out) principle.
class Queue {
    constructor() {
        this.items = []; // Array to store queue elements
    }

    // 1. enqueue: Adds an element to the end of the queue
    enqueue(element) {
        this.items.push(element);
        console.log(`${element} enqueued to queue`);
    }

    // 2. dequeue: Removes and returns the first element of the queue (First In, First Out)
    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty. Cannot dequeue.";
        }
        // shift() removes the first element from an array and returns it
        return this.items.shift();
    }

    // 3. front: Returns the front element without removing it
    front() {
        if (this.isEmpty()) {
            return "Queue is empty.";
        }
        return this.items[0];
    }

    // 4. isEmpty: Checks if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // 5. size: Returns the number of elements in the queue
    size() {
        return this.items.length;
    }
}

// --- Demonstration ---

console.log("--- Testing Stack (FILO/LIFO) ---");
const myStack = new Stack();
myStack.push(10);
myStack.push(20);
myStack.push(30);

console.log("Top element is:", myStack.peek()); // Should be 30
console.log("Popped element:", myStack.pop());   // Should be 30 (Last In, First Out)
console.log("Popped element:", myStack.pop());   // Should be 20
console.log("Stack size is now:", myStack.size()); // Should be 1

console.log("\n--- Testing Queue (FIFO) ---");
const myQueue = new Queue();
myQueue.enqueue("Alice");
myQueue.enqueue("Bob");
myQueue.enqueue("Charlie");

console.log("Front element is:", myQueue.front()); // Should be Alice
console.log("Dequeued element:", myQueue.dequeue()); // Should be Alice (First In, First Out)
console.log("Dequeued element:", myQueue.dequeue()); // Should be Bob
console.log("Queue size is now:", myQueue.size()); // Should be 1
