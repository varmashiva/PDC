const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const checkWorkshops = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Workshop = mongoose.model('Workshop', new mongoose.Schema({ title: String, image: String }));
    const workshops = await Workshop.find({});
    console.log(JSON.stringify(workshops, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkWorkshops();
