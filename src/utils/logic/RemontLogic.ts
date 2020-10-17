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
    return this.remont?.owners?.some(({ id }: any) => id === userId)
  }
}
