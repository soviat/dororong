import { auth, storage } from "./auth.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
export function slugifyFileName(name){
  const parts = name.split('.'); const ext = parts.length>1?'.'+parts.pop():'';
  const base = parts.join('.').normalize('NFKD').replace(/[^\w.-]+/g,'_');
  return base.substring(0,80)+ext.toLowerCase();
}
export async function uploadImages(files, folder="products"){
  const user = auth.currentUser; if(!user) throw new Error("로그인이 필요합니다.");
  const urls = [];
  for(let i=0;i<files.length;i++){
    const f = files[i]; const safe = slugifyFileName(f.name);
    const imageRef = ref(storage, `${folder}/${user.uid}/${Date.now()}_${i}_${safe}`);
    const metadata = { contentType: f.type || 'image/jpeg' };
    await uploadBytes(imageRef, f, metadata);
    const url = await getDownloadURL(imageRef); urls.push(url);
  }
  return { representative: urls[0], all: urls };
}