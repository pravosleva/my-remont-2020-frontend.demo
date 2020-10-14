import { IJob } from '~/common/context/MainContext'

export class JobsLogic extends Object {
  joblist: any
  constructor(joblist) {
    super()
    this.joblist = joblist

    // Set the prototype explicitly.
    // Object.setPrototypeOf(this, Object.prototype)
  }
  get jobs(): IJob[] {
    return this.joblist
  }

  get totalPayed(): number {
    let res = 0

    for (let i = 0, max = this.joblist.length; i < max; i++) {
      if (this.joblist[i].payed > 0) {
        res += this.joblist[i].payed
      }
    }

    return res
  }

  get totalPriceJobs(): number {
    let res = 0

    for (let i = 0, max = this.joblist.length; i < max; i++) {
      if (this.joblist[i].priceJobs > 0) {
        res += this.joblist[i].priceJobs
      }
    }

    return res
  }

  get totalPriceMaterials(): number {
    let res = 0

    for (let i = 0, max = this.joblist.length; i < max; i++) {
      if (this.joblist[i].priceMaterials > 0) {
        res += this.joblist[i].priceMaterials
      }
    }

    return res
  }

  get totalPriceDelivery(): number {
    let res = 0

    for (let i = 0, max = this.joblist.length; i < max; i++) {
      if (this.joblist[i].priceDelivery > 0) {
        res += this.joblist[i].priceDelivery
      }
    }

    return res
  }

  get totalDifference(): number {
    const totalPriceJobs = this.totalPriceJobs
    const totalPriceMaterials = this.totalPriceMaterials
    const totalPriceDelivery = this.totalPriceDelivery
    const totalPayed = this.totalPayed

    return (
      totalPayed - (totalPriceJobs + totalPriceMaterials + totalPriceDelivery)
    )
  }

  getDifference(data: IJob): number {
    return (
      data.payed - (data.priceMaterials + data.priceJobs + data.priceDelivery)
    )
  }

  get comletedJobsCount(): number {
    return this.joblist.filter(({ isDone }) => isDone).length
  }
  get totalJobsCount(): number {
    return this.joblist.length
  }
}
