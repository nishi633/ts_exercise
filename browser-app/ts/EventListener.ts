import { v4 as uuid } from 'uuid'


// HTMLElementEventMapの場合はイベントオブジェクトを引数に持った関数を返す
type Handler<T> = T extends keyof HTMLElementEventMap
  ? (e: HTMLElementEventMap[T]) => void
  : (e: Event) => void

type Listeners = {
  [id: string]: {
    event: string
    element: HTMLElement
    handler: Handler<string>
  }
}

export class EventListener {
  private readonly listeners: Listeners = {}

  add<T extends string>(event: T, element: HTMLElement, handler: Handler<T>, listenerId = uuid()) {
    this.listeners[listenerId] = {
      event,
      element,
      handler,
    }

    // 指定のイベントが実行されたときに第二引数の関数を実行する
    element.addEventListener(event, handler)
  }

  remove(listenerId: string) {
    const listener = this.listeners[listenerId]

    if (!listener) return

    listener.element.removeEventListener(listener.event, listener.handler)

    delete this.listeners[listenerId]
  }
}
