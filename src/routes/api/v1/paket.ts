import { Paket } from '../../../models/Paket'
import { Router } from 'express'

const router = Router()
router.get('/', async (req, res) => {
  try {
    const data = await Paket.find()
    res.json(data)
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})
router.post('/add', async (req, res) => {
  try {
    const data = req.body

    const paket = new Paket(data)
    const result = await paket.save()

    res.json(result)
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const paket = await Paket.findById(Number(id))
    if (!paket) {
      res.status(404).json({ ok: false, message: 'paket tidak ditemukan' })
      return
    }

    res.json(paket)
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

export default router