import multer from "multer";

export const fileValidation = {
  Image: ["image/png", "image/jpeg"],
  file: ["application/pdf"],
};

export const fileUpload = (fileValidation = []) => {
  

  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (fileValidation.includes(file.mimetype))
     cb(null, true);
    else
     cb(new Error("invalid file extension", { cause: 400 }));
  }
  const upload = multer({ fileFilter, storage });
  return upload;
};
