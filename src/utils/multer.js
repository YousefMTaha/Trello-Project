import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(import.meta.url)
export const fileValidation = {
  Image: ["image/png", "image/jpeg"],
  file: ["application/pdf"],
};

export const fileUpload = (customPath = "general",fileValidation = []) => {
  const filePath = `uploads/${customPath}`;
  const fullPath = path.join(__dirname,`../../${filePath}`)
  if (!fs.existsSync(fullPath)) 
      fs.mkdirSync(fullPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname;
      file.finalDest = `${filePath}/${fileName}`;
      const uniqueName = nanoid() + "_" + fileName;
      cb(null, uniqueName);
    },
  });
  function fileFilter(req, file, cb) {
    if (fileValidation.includes(file.mimetype))
     cb(null, true);
    else
     cb(new Error("invalid file extension", { cause: 400 }));
  }
  const upload = multer({ fileFilter, storage });
  return upload;
};
