const express = require('express');
const { uploadMedia } = require('../utils/cloudinary');
const upload = require('../utils/multer');

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            success: true,
            message: "File uploaded successfully.",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error uploading file" });
    }
});

module.exports = router;