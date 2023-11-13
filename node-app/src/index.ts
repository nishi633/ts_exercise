const nextActions = ['play again', 'change game', 'exit'] as const
type NextAction = typeof nextActions[number]
const modes = ['normal', 'hard'] as const
type Mode = typeof modes[number] // 'normal' | 'hard'型
const gameTitles = ['hit and blow', 'janken'] as const
type GameTitle = typeof gameTitles[number]
type GameStore = {
  'hit and blow': HitAndBlow
  'janken': Janken
}

class GameProcedure {
  private currentGameTitle: GameTitle | '' = ''
  private currentGame: HitAndBlow | Janken | null = null

  constructor(private readonly gameStore: GameStore) {}

  public async start() {
    await this.select()
    await this.play()
  }

  private async select() {
    this.currentGameTitle =
      await promptSelect<GameTitle>('ゲームのタイトルを入力してください', gameTitles)
    this.currentGame = this.gameStore[this.currentGameTitle]
  }

  private async play() {
    if (!this.currentGame) throw new Error('ゲームが選択されていません')
    printLine(`===\n${this.currentGameTitle}を開始します。\n===`)
    await this.currentGame.setting()
    await this.currentGame.play()
    this.currentGame.end()

    const action = await promptSelect<NextAction>('ゲームを続けますか？', nextActions)
    if (action === 'play again') {
      await this.play()
    } else if (action === 'change game') {
      await this.select()
      await this.play()
    } else if (action === 'exit') {
      this.end()
    } else {
      const neverValue: never = action
      throw new Error(`${neverValue} is an invalud action.`)
    }
  }

  private end() {
    printLine('ゲームを終了しました')
    process.exit()
  }
}

class HitAndBlow {
  private readonly answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  private answer: string[] = []
  private tryCount = 0
  private mode: Mode = 'normal'

  async setting() {
    this.mode = await promptSelect<Mode>('モードを入力してください', modes)
    const answerLength = this.getAnswerLength()

    while (this.answer.length < answerLength) {
      const randNum = Math.floor(Math.random() * this.answerSource.length)
      const selectedItem = this.answerSource[randNum]
      if (!this.answer.includes(selectedItem)) {
        this.answer.push(selectedItem)
      }
    }
  }

  private validate(inputArr: string[]) {
    const isLengthValid = inputArr.length == this.answer.length
    const isAllAnswerSourceOption = inputArr.every((val) => this.answerSource.includes(val))
    const isAllDifferentValues = inputArr.every((val, i) => inputArr.indexOf(val) === i)
    return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues
  }

  async play() {
    const inputArr = (await promptInput(`「,」区切りで${this.getAnswerLength()}つの数字を入力してください`)).split(',')

    if (!this.validate(inputArr)) {
      printLine('無効な入力です。')
      await this.play()
      return
    }

    const result = this.check(inputArr)

    if (result.hit !== this.answer.length) {
      printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
      this.tryCount += 1
      await this.play()
    } else {
      this.tryCount += 1
    }
  }

  end() {
    printLine(`正解です！\n試行回数: ${this.tryCount}回`)
    this.reset()
  }

  private getAnswerLength() {
    switch (this.mode) {
      case 'normal':
        return 3
      case 'hard':
        return 4
      default:
        // 基本この分岐には入らないがmodeが増えたときの対応漏れを考慮して設定
        throw new Error(`${this.mode}は無効なモードです`)
    }
  }

  private check(input: string[]) {
    let hitCount = 0
    let blowCount = 0

    input.forEach((val, index) => {
      if (val === this.answer[index]) {
        hitCount += 1
      } else if (this.answer.includes(val)) {
        blowCount += 1
      }
    })

    return {
      hit: hitCount,
      blow: blowCount,
    }
  }

  private reset () {
    this.answer = []
    this.tryCount = 0
  }
}

const printLine = (text: string, breakLine: boolean = true) => {
  process.stdout.write(text + (breakLine ? '\n' : ''))
}

const readLine = async() => {
  const input: string = await new Promise((resolve) =>
                          process.stdin.once('data', (data) => resolve(data.toString())))
  // trimするのはインプットの改行を除くため
  return input.trim()
}

const promptSelect = async <T extends string>(text: string, values: readonly T[]): Promise<T> => {
  printLine(`\n${text}`)
  values.forEach((value) => {
    printLine(`- ${value}`)
  })
  printLine(`> `, false)

  const input = (await readLine()) as T
  if (values.includes(input)) {
    return input
  } else {
    return promptSelect<T>(text, values)
  }
}

const promptInput = async (text: string) => {
  printLine(`\n${text}\n> `, false)
  return readLine()
}

// jankenメソッドはコピー
// https://github.com/awesome-typescript-book/code-snapshot/blob/40033d1060933f3f98e645f7dc1fb4a8e2928969/03_node-app/013/05_%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%AE%E9%81%B8%E6%8A%9E%E6%A9%9F%E8%83%BD%E3%81%AE%E5%AE%9F%E8%A3%852/src/index.ts#L157-L236
const jankenOptions = ['rock', 'paper', 'scissors'] as const
type JankenOption = typeof jankenOptions[number]

class Janken {
  private rounds = 0
  private currentRound = 1
  private result = {
    win: 0,
    lose: 0,
    draw: 0,
  }

  async setting() {
    const rounds = Number(await promptInput('何本勝負にしますか？'))
    if (Number.isInteger(rounds) && 0 < rounds) {
      this.rounds = rounds
    } else {
      await this.setting()
    }
  }

  async play() {
    const userSelected = await promptSelect(`【${this.currentRound}回戦】選択肢を入力してください。`, jankenOptions)
    const randomSelected = jankenOptions[Math.floor(Math.random() * 3)]
    const result = Janken.judge(userSelected, randomSelected)
    let resultText: string

    switch (result) {
      case 'win':
        this.result.win += 1
        resultText = '勝ち'
        break
      case 'lose':
        this.result.lose += 1
        resultText = '負け'
        break
      case 'draw':
        this.result.draw += 1
        resultText = 'あいこ'
        break
    }
    printLine(`---\nあなた: ${userSelected}\n相手${randomSelected}\n${resultText}\n---`)

    if (this.currentRound < this.rounds) {
      this.currentRound += 1
      await this.play()
    }
  }

  end() {
    printLine(`\n${this.result.win}勝${this.result.lose}敗${this.result.draw}引き分けでした。`)
    this.reset()
  }

  private reset() {
    this.rounds = 0
    this.currentRound = 1
    this.result = {
      win: 0,
      lose: 0,
      draw: 0,
    }
  }

  static judge(userSelected: JankenOption, randomSelected: JankenOption) {
    if (userSelected === 'rock') {
      if (randomSelected === 'rock') return 'draw'
      if (randomSelected === 'paper') return 'lose'
      return 'win'
    } else if (userSelected === 'paper') {
      if (randomSelected === 'rock') return 'win'
      if (randomSelected === 'paper') return 'draw'
      return 'lose'
    } else {
      if (randomSelected === 'rock') return 'lose'
      if (randomSelected === 'paper') return 'win'
      return 'draw'
    }
  }
}


;(async () => {
  new GameProcedure({
    'hit and blow': new HitAndBlow(),
    'janken': new Janken(),
  }).start()
})()
