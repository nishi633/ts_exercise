import { EventListener } from './EventListener'

class Application {
  start() {
    const eventListener = new EventListener()
    const button = document.getElementById('deleteAllDoneTask')

    // HTMLElementが返らない場合があるため
    if (!button) return

    console.log(button)

    eventListener.add(
      'sample',
      'click',
      button,
      () => alert('clicked'),
    )
  }
}



window.addEventListener('load', () => {
  const app = new Application()
  app.start()
})
