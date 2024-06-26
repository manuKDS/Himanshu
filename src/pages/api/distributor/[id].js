import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const distributor_id = id;
  // GET method to get single records of tbl_distributor table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_distributor")
        .select()
        .eq("distributor_id", distributor_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_distributor table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_distributor")
        .delete()
        .eq("distributor_id", distributor_id);

      error && res.status(401).json("distributor not deleted!");

      res.status(200).json("distributor deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_distributor table
  if (method === "PUT") {
    const { distributor_name, is_active, address, updated_by, org_fid  } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_distributor")
        .update({ distributor_name, is_active, address, updated_by, org_fid  })
        .eq("distributor_id", distributor_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
