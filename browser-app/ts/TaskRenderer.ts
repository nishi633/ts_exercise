import dragula from 'dragula'

import { Status, Task, statusMap } from './Task'

export class TaskRenderer {
  constructor(
    private readonly todoList: HTMLElement,
    private readonly doingList: HTMLElement,
    private readonly doneList: HTMLElement,
  ) {}

  append(task: Task) {
    const { taskEl, deleteButtonEl } = this.render(task)

    this.todoList.append(taskEl)
    return { deleteButtonEl }
  }

  remove(task: Task) {
    // nullの場合もあるのでas HTMLElementはつけない
    const taskEl = document.getElementById(task.id)

    if (!taskEl) return

    this.todoList.removeChild(taskEl)
  }

  subscribeDragAndDrop(onDrop: (el: Element, sibling: Element | null, newStatus: Status) => void) {
    dragula([this.todoList, this.doingList, this.doneList]).on('drop', (el, target, _source, sibling) => {
      // el: 対象の要素
      // target: 移動先の要素
      // source: 移動元の要素
      // sibling: 移動先のすぐ下の要素
      let newStatus: Status = statusMap.todo

      if (target.id === 'doingList') newStatus = statusMap.doing
      if (target.id === 'doneList') newStatus = statusMap.done

      onDrop(el, sibling, newStatus)
    })
  }

  // TaskRenderer以外でDOM APIを意識させないために定義
  getId(el: Element) {
    return el.id
  }

  private render(task: Task) {
    // <dev class="taskItem">
    //   <span>Title</span>
    //   <butotn>Delete</button>
    // </dev>

    const taskEl = document.createElement('div')
    const spanEl = document.createElement('span')
    const deleteButtonEl = document.createElement('button')

    taskEl.id = task.id
    taskEl.classList.add('task-item')

    spanEl.textContent = task.title
    deleteButtonEl.textContent = '削除'

    taskEl.append(spanEl, deleteButtonEl)

    return { taskEl, deleteButtonEl }
  }
}
