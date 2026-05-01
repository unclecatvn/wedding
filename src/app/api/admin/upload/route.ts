import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  getSupabaseStorage,
  supabaseStorageBucket,
} from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseStorage();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase Storage is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json(
      { error: "Unable to upload image." },
      { status: 500 },
    );
  }

  const { data } = supabase.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
