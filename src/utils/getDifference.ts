import { IJob } from '~/pages/projects/[id]/components/Joblist/components/Job/interfaces'

export const getDifference = (data: IJob) => {
  return data.payed - (data.priceMaterials + data.priceJobs + data.priceDelivery)
}

export const getTotalPayed = (joblist: IJob[]): number => {
  let res = 0

  for (let i = 0, max = joblist.length; i < max; i++) {
    if (joblist[i].payed > 0) {
      res += joblist[i].payed
    }
  }

  return res
}
export const getTotalPriceJobs = (joblist: IJob[]): number => {
  let res = 0

  for (let i = 0, max = joblist.length; i < max; i++) {
    if (joblist[i].priceJobs > 0) {
      res += joblist[i].priceJobs
    }
  }

  return res
}
export const getTotalPriceMaterials = (joblist: IJob[]): number => {
  let res = 0

  for (let i = 0, max = joblist.length; i < max; i++) {
    if (joblist[i].priceMaterials > 0) {
      res += joblist[i].priceMaterials
    }
  }

  return res
}
export const getTotalPriceDelivery = (joblist: IJob[]): number => {
  let res = 0

  for (let i = 0, max = joblist.length; i < max; i++) {
    if (joblist[i].priceDelivery > 0) {
      res += joblist[i].priceDelivery
    }
  }

  return res
}

export const getTotalDifference = (joblist: IJob[]) => {
  const totalPriceJobs = getTotalPriceJobs(joblist)
  const totalPriceMaterials = getTotalPriceMaterials(joblist)
  const totalPriceDelivery = getTotalPriceDelivery(joblist)
  const totalPayed = getTotalPayed(joblist)

  return totalPayed - (totalPriceJobs + totalPriceMaterials + totalPriceDelivery)
}
