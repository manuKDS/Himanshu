import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tbl_documents table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_documents")
        .select()
        .order("created_at", { ascending: false });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at expense table
  if (method === "POST") {
    const { document_type, document_name, document_path, production_fid } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_documents")
        .insert({
          document_name,        
          document_type,         
          document_path,
          production_fid
        })
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
