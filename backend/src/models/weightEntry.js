const mongoose= require('mongoose');

const weightEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {

      type: Date,
      required: true,
    },
    weight: {
      // kg
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);


weightEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const weightEntryModel = mongoose.model('weightEntryModel',weightEntrySchema);

module.exports = {
    weightEntryModel,
}
