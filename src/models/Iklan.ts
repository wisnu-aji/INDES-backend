import { Schema, model } from 'mongoose'
import { IklanType } from 'indes-typings'

const IklanSchema = new Schema<IklanType>({
  nama_iklan: {
    required: true,
    type: String,
  },
  expired: {
    required: true,
    type: Date,
  },
  gambar: {
    required: true,
    type: String,
    unique: true,
  },
})

export const Iklan = model('Iklan', IklanSchema, 'iklan')
