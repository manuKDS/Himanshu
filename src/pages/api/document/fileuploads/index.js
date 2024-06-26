import nextConnect from 'next-connect';
import multer from 'multer';
import express from 'express';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',

    filename: (req, file, cb) => cb(null, Date.now()+file.originalname.replace(/[^a-zA-Z.]/g, "")),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use("/uploads", express.static('./public/uploads'));

apiRoute.use(upload.array('theFiles'));

apiRoute.post((req, res) => {
  res.status(200).json({ data: req?.files[0]?.filename });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};