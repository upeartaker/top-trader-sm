'use client'
import { useState } from 'react'
const MODAL_ID = 'modal'
export default function Home() {
  const [chain, setChain] = useState('sol')
  const [biz, setBiz] = useState([
    {
      id: 'f',
      val: '',
    },
    {
      id: 's',
      val: '',
    },
  ])
  const [intersectionData, setIntersectionData] = useState([])
  const handleIntersection = async () => {
    const res = await fetch('/api/intersection', {
      method: 'POST',
      body: JSON.stringify({
        biz: biz.map((b) => b.val).filter((addr) => !!addr),
        chain: chain,
      }),
    })
    const data = await res.json()

    setIntersectionData(data)
    ;(document.getElementById(MODAL_ID)! as HTMLDialogElement).showModal()
  }

  const handleChain = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChain(e.target.checked ? 'eth' : 'sol')
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <label className='swap mb-10'>
        <input type='checkbox' onChange={handleChain} />
        <div className='swap-on'>ETH</div>
        <div className='swap-off'>SOL</div>
      </label>
      {biz.map((v, idx) => {
        return (
          <div className='mb-10 w-[320px] relative' key={idx}>
            <input
              type='text'
              placeholder='Contract Address'
              value={v.val}
              className='input input-bordered w-full max-w-xs '
              onChange={(e) => {
                setBiz((pre) => {
                  return pre.map((obj) => {
                    if (obj.id === v.id) {
                      return {
                        ...obj,
                        val: e.target.value,
                      }
                    }
                    return obj
                  })
                })
              }}
            />
            {idx === biz.length - 1 && (
              <button
                className='btn btn-circle ml-10 absolute text-[20px]'
                onClick={() => {
                  setBiz((pre) => {
                    return pre.concat([
                      {
                        id: crypto.randomUUID(),
                        val: '',
                      },
                    ])
                  })
                }}
              >
                +
              </button>
            )}
          </div>
        )
      })}

      <button className='btn' onClick={handleIntersection}>
        Intersection
      </button>

      <dialog id={MODAL_ID} className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Intersection Address</h3>
          {intersectionData.length > 0
            ? intersectionData.map((addr) => {
                return (
                  <p className='py-4' key={addr}>
                    {addr}
                  </p>
                )
              })
            : 'no intersection data'}
          <div className='modal-action'>
            <form method='dialog'>
              {/* if there is a button in form, it will close the modal */}
              <button className='btn'>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </main>
  )
}
