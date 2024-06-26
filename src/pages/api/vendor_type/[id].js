import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const vendor_type_id = id;

  // UPDATE method to update single record at tbl_vendor_type table
  if (method === "PUT") {
    const { vendor_type, org_fid } = req.body;
    console.log("Server-", vendor_type_id, vendor_type, org_fid);

    try {
      const { data, error } = await supabase
        .from("tbl_vendor_type")
        .update({ vendor_type: vendor_type, org_fid: org_fid })
        .eq("vendor_type_id", vendor_type_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      console.log(4);
      res.status(500).json(err);
    }
  }

  // GET method to get single records of tbl_vendor_type table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_vendor_type")
        .select()
        .eq("vendor_type_id", vendor_type_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_vendor_type table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_vendor_type")
        .delete()
        .eq("vendor_type_id", vendor_type_id);

      error && res.status(401).json("Vendor Type not deleted!");

      res.status(200).json("vendor_type deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
