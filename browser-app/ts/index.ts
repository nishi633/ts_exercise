import { EventListener } from './EventListener'
import { Task } from './Task'

class Application {
  private readonly eventListener = new EventListener()

  start() {
    const createForm = document.getElementById('createForm') as HTMLElement
    this.eventListener.add('submit-handler', 'submit', createForm, this.handleSubmit)
  }

  private handleSubmit = (e: Event) => {
    e.preventDefault() // formのデフォルトの動作をキャンセル

    // inputフォームのvalueを取得するためHTMLInputElementを利用
    const titleInput = document.getElementById('title') as HTMLInputElement

    // フォームに入力がない場合はタスクを追加しない
    if (!titleInput.value) return

    const task = new Task({ title: titleInput.value })
    console.log(task)
  }
}

window.addEventListener('load', () => {
  const app = new Application()
  app.start()
})
