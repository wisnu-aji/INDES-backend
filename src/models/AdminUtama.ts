import { Schema, model } from 'mongoose'
import { AdminType } from 'indes-typings'

const AdminSchema = new Schema<AdminType>({
  email: {
    required: true,
    type: String,
  },
  nama: {
    required: true,
    type: String,
  },
})

export const AdminUtama = model('AdminUtama', AdminSchema, 'AdminUtama')