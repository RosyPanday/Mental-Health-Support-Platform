import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const documentDirectory = "uploads/therapistDocuments";
const profilePictureDirectory = "uploads/therapistProfilePictures";

[profilePictureDirectory, documentDirectory].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profilePic") {
      cb(null, profilePictureDirectory);
    } else {
      cb(null, documentDirectory);
    }
  },
  filename: (req, file, cb) => {
    const userId = req.user.id;
    const ext = path.extname(file.originalname);
    const customFileName = `therapist_${userId}_${file.fieldname}_${Date.now()}${ext}`;
    cb(null, customFileName);
  },
});

export const uploadTherapistDocuments = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, //10mb limit
}).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "educationalDoc1", maxCount: 1 },
  { name: "educationalDoc2", maxCount: 1 },
  { name: "professionalDoc", maxCount: 1 },
]);
