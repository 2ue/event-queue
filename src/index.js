/**
 * 事件队列
 * 1.可以控制事件发生的最大并行数
 * 2.打断队列中后续任务的添加，breakRun(eventOptions)来控制
 * 3.允许在队列在执行过程中，继续向队列添加任务
 * TO DO：
 * 1.完成回调/执行结果返回，目前可以直接在外部处理结果
 * 2.异常检查：对某些特殊错误进行检查
 * 3.暂停/取消/销毁
 * */

const OPTIONS = {
  // 任务同时执行的最大个数
  maxEventNumber: 5,
  // 队列任务是否并行(异步)执行。
  // 注意：把maxEventNumber设置为1, async则不会起作用，此时本质上是同步
  async: true,
  // 用于中断继续向执行队列中添加任务，返回false(默认是false)表示继续添加
  breakRun() {},
  // TO DO 单个任务完成后执行，目前来说没必要，外部可以自由控制
  complete() {},
  // TO DO 所有任务完成后执行，目前来说没必要，外部可以自由控制
  completeAll() {},
};

function fixedMaxEventNumber(number) {
  return isNaN(number) || number <= 0 ? OPTIONS.maxEventNumber : number;
}

function typeFun(fun, defaultValue) {
  if (fun && typeof fun === 'function') return true;
  return defaultValue;
}

function EventQueue(options) {
  this.init(options);
}

EventQueue.prototype = {
  constructor: EventQueue,
  /**
   * 初始化实例配置
   * */
  init(options = {}) {
    this.options = { ...OPTIONS, ...options };
    // 修正maxEventNumber，防止报错
    this.options.maxEventNumber = fixedMaxEventNumber(this.options.maxEventNumber);
    // 事件队列合集
    this.eventList = [];
    // 已完成事件队列
    // TODO: 通过done传入参数，导入结果，实现结果的处理
    this.overEventList = [];
    // 正在执行的事件个数
    this.eventRunNumber = 0;
    // 已经完成的事件个数
    this.eventOverNumber = 0;
  },
  /**
   * 队列中单个任务结束标识
   * 队列中函数结束时，需要手动调用此标识结束。
   * 外部创建队列时使用
   * */
  done() {
    // 计数
    this.eventRunNumber -= 1;
    this.eventOverNumber += 1;
    this.run();
  },
  /**
   * 把方法推送到队列中
   * */
  add(eventList) {
    if (typeof eventList === 'function') eventList = [eventList];
    if (eventList && eventList.length > 0) {
      eventList.map((event) => {
        this.on(event);
      });
    }
    return this;
  },
  on(event) {
    this.eventList.push(event);
  },
  /**
   * 执行待执行队列(eventList)中的任务
   * 执行队列中的任务不超过maxEventNumber值
   * */
  run() {
    const {
      eventList,
      eventRunNumber,
      eventOverNumber,
      options,
    } = this;
    // 如果正在执行的队列超过限制，则中断
    if (eventRunNumber >= options.maxEventNumber) return;
    const eventIndex = eventRunNumber + eventOverNumber;
    // 即将执行的任务
    const event = eventList[eventIndex];
    // 没有任务，执行完了
    if (!event) {
      if (typeFun(options.completeAll)) options.completeAll(this.overEventList);
      return;
    }
    if (options.breakRun && options.breakRun({ eventRunNumber, eventOverNumber })) return;
    // 执行当前任务
    this.emit(event);
    // 添加下一个任务
    this.eventRunNumber += 1;
    this.run();
  },
  emit(event) {
    if (this.options.async) {
      setTimeout(() => {
        this.overEventList.push(event.apply(this, arguments));
      }, 6);
    } else {
      this.overEventList.push(event.apply(this, arguments));
    }
  },
};

export default EventQueue;
