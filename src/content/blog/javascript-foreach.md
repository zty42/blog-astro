---
title: "forEach异步问题"
date: "2023-05-26"
description: ""
tags: [javascript]
---

## 问题

我们定义了一组执行步骤 steps 和一个模拟异步执行的函数 execute，希望能够按顺序执行每一个步骤，并打印出结果。

```javascript
const steps = ["step1", "step2", "step3"];

const execute = async (step) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(step);
    }, Math.random() * 100);
  });
};
```

先用 forEach 实现一下

```javascript
const executeStepsForeach = async () => {
  steps.forEach(async (step) => {
    const result = await execute(step);
    console.log(result); //打印顺序是随机的
  });
};
executeStepsForeach();
```

用 for of 实现一下

```javascript
const executeStepsForOf = async () => {
  for await (const step of steps) {
    const result = await execute(step);
    console.log(result); // 打印 step1 step2 step3
  }
};
executeStepsForOf();
```

## 原因

**forEach**方法直接遍历数组并执行回调函数，无法保证异步任务的执行顺序。如果后面的任务执行时间较短，就可能在前面的任务之前完成执行。

**for...of**循环实际上是基于迭代器(Iterator)的遍历方式。对于数组来说，它是一种可迭代对象，可以通过迭代器进行遍历。

数组是如何创建迭代器的呢?

```javascript
const steps = ["step1", "step2", "step3"];
const iterator = steps[Symbol.iterator]();
console.log(iterator.next()); // {value: "step1", done: false}
console.log(iterator.next()); // {value: "step2", done: false}
console.log(iterator.next()); // {value: "step3", done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

## 总结

使用 for...of 循环可以保证异步任务的执行顺序，但是如果异步任务之间没有依赖关系，可以使用 Promise.all()方法来并发执行异步任务，提高效率。
