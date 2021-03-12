export type TFormat = {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  path: any
  url: string
}
export type TFormatsData = {
  large?: TFormat
  medium?: TFormat
  thumbnail: TFormat
  small?: TFormat
}

export type TFile = {
  _id: string
  name: string
  hash: string
  ext: string
  mime: string
  size: number
  width: number
  height: number
  url: string
  formats: TFormatsData
  provider: string
  related: any[]
  createdAt: string // "2021-03-11T19:49:50.190Z"
  updatedAt: string // "2021-03-11T19:49:50.190Z"
  __v: number
}

/* DELETE result sample:
{
	"_id": "604befdcb8d3f01d0be41253",
	"name": "23922498431_da84d45ce1_b.jpg",
	"hash": "23922498431_da84d45ce1_b_7f65288ac2",
	"ext": ".jpg",
	"mime": "image/jpeg",
	"size": 177.96,
	"width": 1024,
	"height": 683,
	"url": "/uploads/23922498431_da84d45ce1_b_7f65288ac2.jpg",
	"formats": {
		"thumbnail": {
			"name": "thumbnail_23922498431_da84d45ce1_b.jpg",
			"hash": "thumbnail_23922498431_da84d45ce1_b_7f65288ac2",
			"ext": ".jpg",
			"mime": "image/jpeg",
			"width": 234,
			"height": 156,
			"size": 12.86,
			"path": null,
			"url": "/uploads/thumbnail_23922498431_da84d45ce1_b_7f65288ac2.jpg"
		},
		"large": {
			"name": "large_23922498431_da84d45ce1_b.jpg",
			"hash": "large_23922498431_da84d45ce1_b_7f65288ac2",
			"ext": ".jpg",
			"mime": "image/jpeg",
			"width": 1000,
			"height": 667,
			"size": 164.25,
			"path": null,
			"url": "/uploads/large_23922498431_da84d45ce1_b_7f65288ac2.jpg"
		},
		"medium": {
			"name": "medium_23922498431_da84d45ce1_b.jpg",
			"hash": "medium_23922498431_da84d45ce1_b_7f65288ac2",
			"ext": ".jpg",
			"mime": "image/jpeg",
			"width": 750,
			"height": 500,
			"size": 99.89,
			"path": null,
			"url": "/uploads/medium_23922498431_da84d45ce1_b_7f65288ac2.jpg"
		},
		"small": {
			"name": "small_23922498431_da84d45ce1_b.jpg",
			"hash": "small_23922498431_da84d45ce1_b_7f65288ac2",
			"ext": ".jpg",
			"mime": "image/jpeg",
			"width": 500,
			"height": 333,
			"size": 48.44,
			"path": null,
			"url": "/uploads/small_23922498431_da84d45ce1_b_7f65288ac2.jpg"
		}
	},
	"provider": "local",
	"related": [],
	"createdAt": "2021-03-12T22:49:00.501Z",
	"updatedAt": "2021-03-12T22:49:00.501Z",
	"__v": 0,
	"id": "604befdcb8d3f01d0be41253"
}
*/
