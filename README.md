# event-queue

events(async or sync) list management

## Use

- maxEventNumber：{number} can run max event，default `5`
- async：{boolean} event list run with async or sync，default `false`, it means sync
- breakRun：{function} break the add event to event list，while `false`(default return `false`)，can continue to add

```bash
npm install -S event-queuejs
// or
yarn add event-queuejs
```

```javascript
import EventQueue from 'event-queuejs';
const eventQueue = new EventQueue();
const eventList = [];
const eventArr = new Array(46).join(',').split(',');
eventArr.map(() => {
  eventList.push(() => {
    // mock event(async)
    setTimeout(() => {
      // do something...
      // ...
      
      // notify done, and to run next event(function internal)
      eventQueue.done();
    }, 6000 * Math.random());
  });
});
// add event list to instance and run it!
eventQueue.add(eventList).run();
```
