import { Router } from 'express'

const router = Router()

router.post('/notify', async (req, res) => {
  console.log('/notify: ', req.body)
  res.json({ok:true})
})
router.post('/cancel', async (req, res) => {
  console.log('/cancel: ', req.body)
  res.json({ok:true})
})



export default router