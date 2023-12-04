import { Status, Task } from './Task'

const STORAGE_KEY = 'TASKS'

export class TaskCollection {
  private tasks: Task[] = []
  private readonly storage


  add(task: Task) {
    this.tasks.push(task)
    this.updateStorage()
  }

  find(id: string) {
    return this.tasks.find((task) => task.id === id)
  }

  update(task: Task) {
    this.tasks = this.tasks.map((item) => {
      if (item.id === task.id) return task
      return item
    })
  }

  delete(task: Task) {
    this.tasks = this.tasks.filter(({ id }) => id !== task.id)
    this.updateStorage()
  }

  filter(filterStatus: Status) {
    return this.tasks.filter(({ status }) => status === filterStatus)
  }

  private updateStorage() {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
  }
}
