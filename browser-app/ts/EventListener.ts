type Listeners = {
  [id: string]: {
    event: string
    element: HTMLElement
    handler: (e: Event) => void
  }
}

export class EventListener {
  private readonly listeners: Listeners = {}

  add(listenerId: string, event: string, element: HTMLElement, handler: (e: Event) => void) {
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
