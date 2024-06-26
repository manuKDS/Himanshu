import nextConnect from "next-connect";
import multer from "multer";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const documentname = id;
  console.log("001");
  // GET method to get single records of tbl_documents table
  if (method === "GET") {
    console.log("111");
    try {
      const file = await fs.readFile("./uploads/" + documentname);
      console.log(file);
      res.setHeader("Content-Type", file.file_mimetype);
      res.send(file);
    } catch (error) {
      console.log("333");
      res.status(400).send("Error while downloading file. Try again later.");
    }
  }
}
