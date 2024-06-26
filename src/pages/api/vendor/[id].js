import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const vendor_id = id;

  // UPDATE method to update single record at tbl_vendor table
  if (method === "PUT") {
    const {
      updated_by,
      name,
      vendor_type_fid,
      city_fid,
      org_fid,
      address,
      phone,
      email,
      url,
    } = req.body;
    console.log(
      "Server-",
      updated_by,
      name,
      vendor_type_fid,
      city_fid,
      org_fid,
      address,
      phone,
      email,
      url
    );

    try {
      const { data, error } = await supabase
        .from("tbl_vendor")
        .update({
          updated_by: updated_by,
          name: name,
          vendor_type_fid: vendor_type_fid,
          city_fid: city_fid,
          org_fid: org_fid,
          address: address,
          phone: phone,
          email: email,
          url: url,
        })
        .eq("vendor_id", vendor_id)
        .select();
      console.log(33);
      res.status(200).json(data);
    } catch (err) {
      console.log(43);
      res.status(500).json(err);
    }
  }

  // GET method to get single records of tbl_vendor table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_vendor")
        .select()
        .eq("vendor_id", vendor_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_vendor table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_vendor")
        .delete()
        .eq("vendor_id", vendor_id);

      error && res.status(401).json("Vendor not deleted!");

      res.status(200).json("Vendor deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
