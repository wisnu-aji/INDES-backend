import { Router } from 'express'
import { PelangganType, User } from 'indes-typings'
import { addNewUser } from '../../../lib/addNewUser'
import { getBatasPembayaran } from '../../../lib/getBatasPembayaran'
import { Pelanggan } from '../../../models/Pelanggan'
const router = Router()

router.post('/add', async (req, res) => {
  try {
    const body = req.body as User
    body.batasPembayaran = getBatasPembayaran(
      new Date(body.pemasangan),
      new Date(body.pemasangan).getDate()
    )
    console.log(req.body)
    const save = await addNewUser(body)
    if (typeof save === 'string') throw new Error(save)
    res.json(save)
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

router.post('/edit', async (req, res) => {
  try {
    const body = req.body as PelangganType
    const updated = await Pelanggan.findByIdAndUpdate(body._id, body)
    res.json(updated)
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

interface List {
  page: number
  limit: number
  sortBy: 'nama' | 'alamat' | 'telepon' | null
  status: 'telat-bayar' | 'sudah-bayar' | null
}

router.post('/list', async (req, res) => {
  try {
    const body = req.body as List
    const payload =
      body.status === 'telat-bayar'
        ? { batasPembayaran: { $gt: new Date() } }
        : body.status === 'sudah-bayar'
        ? { batasPembayaran: { $lte: new Date() } }
        : {}
    const sortPayload = body.sortBy ? { [body.sortBy]: 1 } : {}
    const list = await Pelanggan.find(payload)
      .skip((+body.page - 1) * +body.limit)
      .limit(+body.limit)
      .sort(sortPayload)
    res.json(list)
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})
interface Query {
  query: string
  page: number
  limit: number
}

router.post('/search', async (req, res) => {
  try {
    const body = req.body as Query
    if (+body.query) {
      const list = await Pelanggan.find({
        $or: [{ telepon: +body.query }, { _id: +body.query }],
      })
        .skip((+body.page - 1) * +body.limit)
        .limit(+body.limit)
      res.json(list)
    } else {
      const query = new RegExp(body.query, 'i')
      const list = await Pelanggan.find({
        $or: [{ nama: query }, { alamat: query }],
      })
        .skip((+body.page - 1) * +body.limit)
        .limit(+body.limit)

      res.json(list)
    }
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})
interface Stat {
  status: 'telat-bayar' | 'sudah-bayar'
}
router.post('/stat', (req, res) => {
  try {
    const body = req.body as Stat
    const list =
      body.status === 'telat-bayar'
        ? { batasPembayaran: { $gt: new Date() } }
        : body.status === 'sudah-bayar'
        ? { batasPembayaran: { $lte: new Date() } }
        : {}
    Pelanggan.countDocuments(list, (err, count) => {
      if (err) {
        res.status(500).json({ ok: false, message: err.message })
        return
      }
      res.json({ ok: true, count })
    })
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})
router.post('/remove', async (req, res) => {
  try {
    const body = req.body as PelangganType
    const updated = await Pelanggan.findByIdAndRemove(body._id)
    res.json(updated)
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

export default router
