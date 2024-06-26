import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tax_regional_bonus table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_tax_regional_bonus")
        .select()
       // .order("tax_regional_bonus", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at tax_regional_bonus table
  // if (method === "POST") {
  //   const { tax_regional_bonus, country_fid, is_active } = req.body;
  //   try {
  //     const { data, error } = await supabase
  //       .from("tbl_tax_regional_bonus")
  //       .insert({ tax_regional_bonus, country_fid, is_active })
  //       .select();
  //     error && res.status(500).json(error);

  //     res.status(200).json(data);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }
}
