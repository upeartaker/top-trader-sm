function getArrayIntersection(arr: string[][]): string[] {
  const elementCount: { [key: string]: number } = {}

  // 统计每个元素在所有子数组中出现的次数
  arr.forEach((subArray) => {
    subArray.forEach((element) => {
      if (elementCount[element]) {
        elementCount[element]++
      } else {
        elementCount[element] = 1
      }
    })
  })

  // 只保留那些出现次数等于子数组总数的元素
  const totalSubArrays = arr.length
  const intersection = Object.keys(elementCount).filter(
    (element) => elementCount[element] === totalSubArrays
  )

  return intersection
}

export async function POST(request: Request) {
  const params = await request.json()
  if (!Array.isArray(params?.biz) || params?.biz.length < 1) {
    return Response.json([])
  }
  const chain = params.chain || 'sol'
  const getTopTraders = params.biz.map((addr: string) => {
    return fetch(
      `https://gmgn.ai/defi/quotation/v1/tokens/top_traders/${chain}/${addr}?orderby=realized_profit&direction=desc`,
      {
        method: 'GET',
      }
    ).then((res) => res.json())
  })

  try {
    const data = await Promise.all(getTopTraders)
    const addressList = data.map((current) => {
      return current.data.map((d: { address: string }) => {
        return d.address
      })
    })
    console.log(123,addressList)
    const res = getArrayIntersection(addressList)
    return Response.json(res)
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return Response.json([])
  }
}

export const runtime = 'edge'
