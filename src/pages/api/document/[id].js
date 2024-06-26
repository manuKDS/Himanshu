import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const document_id = id;
  // GET method to get single records of tbl_documents table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_documents")
        .select()
        .eq("document_id", document_id);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_documents table
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_documents")
        .delete()
        .eq("document_id", document_id);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_documents table
//   if (method === "PUT") {
//     const { app_type, province_fid, production_fid, org_fid } = req.body;
//     try {
//       const { data, error } = await supabase
//         .from("tbl_documents")
//         .update({ 
//           app_type,
//           // app_sub_type: appSubType,
//           province_fid,
//           // city_fid: cityId,
//           org_fid,
//           production_fid
//          })
//         .eq("document_id", document_id)
//         .select();
  

//       error && res.status(500).json(error);

//       res.status(200).json(data);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
}
