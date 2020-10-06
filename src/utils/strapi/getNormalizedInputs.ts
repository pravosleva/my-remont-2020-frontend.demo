type TLoginInputs = {
  email: string
  password: string
}

export const getNormalizedInputs = (inputs: TLoginInputs) => {
  const fromTo = [
    ['email', 'identifier'],
    ['username', 'identifier'],
  ]
  const result = {}

  Object.keys(inputs).forEach((key: string) => {
    const targetIndex = fromTo.findIndex((arr) => arr[0] === key)
    const shouldBeNormalized = targetIndex !== -1

    if (shouldBeNormalized) {
      // @ts-ignore
      const value = inputs[key]
      const newKey = fromTo[targetIndex][1]

      // @ts-ignore
      result[newKey] = value
    } else {
      // @ts-ignore
      result[key] = inputs[key]
    }
  })

  return result
}
