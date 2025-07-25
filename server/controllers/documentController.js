const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  try {
    const uploadedBy = req.user._id;
    const { title, category } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!fileUrl) {
      return res.status(400).json({ message: "File upload is required." });
    }

    // Use title from body or fallback to original filename if not provided
    const docTitle = title || req.file.originalname;

    const newDoc = await Document.create({
      title: docTitle,
      fileUrl,
      uploadedBy,
      category,
    });

    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload document', error });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().populate('uploadedBy', 'name');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get documents', error });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
};
