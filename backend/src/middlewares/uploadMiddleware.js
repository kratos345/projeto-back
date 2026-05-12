const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadsRoot = path.resolve(__dirname, '../uploads');

const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const createStorage = (subfolder) => {
  const uploadFolder = path.join(uploadsRoot, subfolder);
  ensureFolder(uploadFolder);

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    }
  });
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas.'), false);
  }
};

const createUploadMiddleware = (subfolder) => multer({
  storage: createStorage(subfolder),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const upload = createUploadMiddleware('users');

module.exports = { upload, createUploadMiddleware };
