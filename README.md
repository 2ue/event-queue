# event-queue

用来控制事件(异步或者同步)的管理

## Use

- maxEventNumber：{number} 允许最大并行任务数量，默认为5
- async：{boolean} 是否需要异步执行，默认false
- breakRun：{function} 用于中断继续向执行队列中添加任务，返回false(默认是false)表示继续添加

```javascript
  import EventQueue from './index';
  const eventQueue = new EventQueue();
  const eventList = [];
  const eventArr = new Array(46).join(',').split(',');
  eventArr.map(() => {
    // 模拟事件发生
    eventList.push(() => {
      setTimeout(() => {
        // do something...
        // 调用完成标记, 通知执行下一个任务
        eventQueue.done();
      }, 6000 * Math.random());
    });
  });
  eventQueue.add(taskList).run();
```