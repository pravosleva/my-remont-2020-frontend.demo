export interface IJob {
  name: string
  _id: string
  comment?: string
  description?: string
  payed: number
  priceJobs: number
  priceMaterials: number
  priceDelivery: number
  isDone: boolean
  isStarted: boolean
}
