

const mongoose = require('mongoose');


const AdminSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },


    password: {
      type: String,
      required: [true, 'Password is required'],
    },


    image: {
      type: String,
      default: 'default-avatar.png',
    },


    created_date: {
      type: Date,
      default: Date.now,
    },
  },
  {

    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', AdminSchema);
