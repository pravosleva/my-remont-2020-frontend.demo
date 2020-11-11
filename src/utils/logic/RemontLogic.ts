import { IJob } from '~/common/context/MainContext'

export class RemontLogic extends Object {
  remont: any | null
  constructor(remont: any | null) {
    super()
    this.remont = remont
  }
  get id() {
    return this.remont?.id || null
  }
  get name() {
    return this.remont?.name || null
  }

  isOwner(userId: string): boolean {
    if (!userId) return false
    return this.remont?.owners?.some(({ id }: any) => id === userId) || false
  }

  get isDoneCounter(): boolean {
    return this.remont?.joblist.filter(({ isStarted, isDone }: IJob) => isStarted && isDone).length || 0
  }
  get inProgressCounter(): boolean {
    return this.remont?.joblist.filter(({ isStarted , isDone}: IJob) => isStarted && !isDone).length || 0
  }
  get allCounter(): boolean {
    return this.remont?.joblist.length || 0
  }
}
