const mongoose= require('mongoose');

const weightEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      // Stored as midnight UTC for the calendar day this entry represents.
      // Normalization happens in the controller before every read/write,
      // not here — Mongoose doesn't run custom logic on queries, only on
      // document saves, so relying on a schema-level default would silently
      // miss the query side.
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

// One entry per user per day. Logging twice on the same day updates
// the existing document instead of creating a duplicate.
weightEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const weightEntryModel = mongoose.model('weightEntryModel',weightEntrySchema);

module.exports = {
    weightEntryModel,
}