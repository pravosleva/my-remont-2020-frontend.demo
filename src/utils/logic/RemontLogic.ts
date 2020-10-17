import { IJob } from '~/common/context/MainContext'

export class RemontLogic extends Object {
  remont: any
  constructor(remont: any) {
    super()
    this.remont = remont
  }

  isOwner(userId: string): boolean {
    if (!userId) return false
    return this.remont.owners.some(({ id }: any) => id === userId)
  }
}
