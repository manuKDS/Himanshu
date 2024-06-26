import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const production_id = id;

  // UPDATE method to update single record at tbl_production table
  if (method === "PUT") {
    const {    
      status    
    } = req.body;

    try {
      const { data, error } = await supabase
        .from("tbl_production")
        .update({         
          status         
        })
        .eq("production_id", production_id)
        .select();

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

 
}
