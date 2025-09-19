import { auth, db, storage, nowTs } from "./auth.js";
import {
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { compressImage } from "./utils/image.js";
import { qs, toast } from "./utils/dom.js";

const formSel = {
  title: '#title',
  category: '#category',
  price: '#price',
  description: '#description',
  imageInput: '#image-input',
  imageDrop: '#image-drop'
};

let files = [];

function bindFileInputs(){
  const input = document.querySelector(formSel.imageInput);
  const drop = document.querySelector(formSel.imageDrop);
  if(!input) return;
  input.addEventListener('change', (e) => {
    files = Array.from(e.target.files || []).slice(0,10);
    preview(files);
  });
  if(drop){
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('ring-2'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('ring-2'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault(); drop.classList.remove('ring-2');
      files = Array.from(e.dataTransfer.files || []).slice(0,10);
      preview(files);
    });
    drop.addEventListener('click', () => input.click());
  }
}

function preview(list){
  const grid = document.querySelector('#image-preview');
  if(!grid) return;
  grid.innerHTML = list.map(() => `<div class="w-full h-24 rounded-lg bg-gray-100 animate-pulse"></div>`).join('');
}

async function handleSubmit(e){
  e.preventDefault();
  if(!auth.currentUser){ toast("로그인이 필요합니다."); return; }
  const title = qs('title').value.trim();
  const category = qs('category').value;
  const price = Number(qs('price').value || 0);
  const description = qs('description').value.trim();
  if(!title || !price){ toast("제목/가격을 입력해주세요."); return; }

  try{
    const docRef = await addDoc(collection(db, "products"), {
      uid: auth.currentUser.uid,
      title, category, price,
      description,
      images: [],
      status: "active",
      createdAt: serverTimestamp()
    });

    const urls = [];
    for (let i=0; i<Math.min(files.length, 10); i++){
      const f = await compressImage(files[i], { maxWidth: 1600, maxHeight: 1600, quality: 0.85 });
      const storagePath = `products/${auth.currentUser.uid}/${docRef.id}/${Date.now()}_${i}.jpg`;
      const sref = ref(storage, storagePath);
      await uploadBytes(sref, f, { contentType: f.type });
      const url = await getDownloadURL(sref);
      urls.push(url);
    }

    if(urls.length){
      const { updateDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js");
      await updateDoc(doc(db, "products", docRef.id), { images: urls });
    }

    toast("상품이 등록되었습니다.");
    location.href = `product_detail.html?id=${encodeURIComponent(docRef.id)}`;
  }catch(err){
    console.error(err);
    toast("등록에 실패했습니다.");
  }
}

function init(){
  bindFileInputs();
  const form = document.querySelector('#register-form');
  if(form) form.addEventListener('submit', handleSubmit);
}

document.addEventListener('DOMContentLoaded', init);