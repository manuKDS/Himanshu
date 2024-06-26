import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const role_id = id;

  // UPDATE method to update single record at tbl_role table
  if (method === "PUT") {
    const {    
      status    
    } = req.body;
console.log(status)
    try {
      const { data, error } = await supabase
        .from("tbl_role")
        .update({         
          is_active: status         
        })
        .eq("role_id", role_id)
        .select();

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

 
}
