import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of production table
  if (method === "GET") {
    try {
      
      let { data, error } = await supabase
        .from("tbl_production")        
        .select()
        .order("production", { ascending: true });

      error && res.status(500).json(error);
     
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at production table
  if (method === "POST") {
    const {
      modified_by,
      org_fid,
      production,
      status,
      distributor_fid,
      genre_fid,
      incorporation_name,
      incorporation_date,
      Incorporation_in,
      province_fid,
      type,
    } = req.body;

    // console.log( 
    //   modified_by,
    //   org_fid,
    //   production,
    //   ( status === 1 ? true : false),
    //   distributor_fid,
    //   genre_fid,
    //   incorporation_name,
    //   incorporation_date,
    //   Incorporation_in,
    //   province_fid)
    
    try {
      const { data, error } = await supabase
        .from("tbl_production")
        .insert({         
          production,
          status: ( status === 1 ? true : false),
          distributor_fid,
          genre_fid,
          incorporation_name,
          incorporation_date,
          Incorporation_in,
          province_fid,
          modified_by,
          org_fid,
          type,
        })
        .select();
      
        error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
