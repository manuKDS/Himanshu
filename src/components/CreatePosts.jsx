"use client";
import supabase from "@/lib/supabaseClient";

const handleSubmit = async () => {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: "new post 5",
      user_id: "e7ffac67-22ae-4632-bbfc-18deac28acc3",
    })
    .select();

  console.log(data, error);
};

const handleUpdate = async () => {
  return await supabase
    .from("posts")
    .update({ title: "Post 1" })
    .eq("id", 3)
    .select();
};
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  console.log(error);
};

const CreatePosts = () => {
  return (
    <div className='flex gap-2'>
      <button className='p-2 border-2 rounded-sm' onClick={handleSubmit}>
        Create Post
      </button>
      <button className='p-2 border-2 rounded-sm' onClick={handleUpdate}>
        Update Post
      </button>

      <button className='p-2 border-2 rounded-sm' onClick={signOut}>
        Sign out{" "}
      </button>
    </div>
  );
};

export default CreatePosts;
