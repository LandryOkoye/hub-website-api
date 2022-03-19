const Media = require("../models/media");

class MediaService {
  getAllMediaResources() {
    return Media.find().select("name url type size").sort({ createdAt: -1 });
  }

  create(media) {
    return Media.create(media);
  }

  findById(id) {
    return Media.findById(id);
  }

  update(id, updateQuery) {
    return Media.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  delete(id) {
    return Media.findByIdAndDelete(id);
  }
}

module.exports = new MediaService();
