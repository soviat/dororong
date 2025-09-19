// Cloud Functions (v2) — ESM + Admin v12 호환
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import PDFDocument from "pdfkit";

// v2 공통 옵션 (서울 리전 권장)
setGlobalOptions({ region: "asia-northeast3", memory: "256MiB", timeoutSeconds: 60 });

// Admin SDK init
initializeApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

// ----------------- Helpers -----------------
function calcFeeKRW(amount) {
  const n = Number(amount || 0);
  return n < 200000 ? Math.round(n * 0.05) : 10000;
}

async function txOrder(orderId, mutator) {
  const ref = db.collection("orders").doc(orderId);
  return await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "order not found");
    const cur = snap.data();
    const next = await mutator(cur);
    if (next) tx.set(ref, { ...next, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return { ...cur, ...(next || {}) };
  });
}

function assert(cond, code, msg) {
  if (!cond) throw new HttpsError(code, msg);
}

// ----------------- Triggers -----------------
// 주문 생성 시 수수료/정산금 계산
export const onOrderCreate = onDocumentCreated("orders/{id}", async (event) => {
  const snap = event.data;
  if (!snap) return;
  const o = snap.data();
  const price = Number(o.price || 0);
  const fee = calcFeeKRW(price);
  const settleAmount = Math.max(0, price - fee);
  await snap.ref.set({ fee, settleAmount }, { merge: true });
});

// 주문 상태 변경 시 정산 레코드 기록
export const onOrderStatusWrite = onDocumentWritten("orders/{id}", async (event) => {
  const before = event.data?.before?.data() || null;
  const after = event.data?.after?.data() || null;
  if (!after || (before && before.status === after.status)) return;

  const id = event.params.id;
  if (after.status === "released") {
    await db.collection("orders").doc(id).collection("settlements").add({
      type: "payout",
      amount: Number(after.settleAmount || 0),
      fee: Number(after.fee || 0),
      to: after.sellerId,
      at: FieldValue.serverTimestamp(),
    });
  }
  if (after.status === "refunded") {
    await db.collection("orders").doc(id).collection("settlements").add({
      type: "refund",
      amount: Number(after.price || 0),
      to: after.buyerId,
      at: FieldValue.serverTimestamp(),
    });
  }
});

// ----------------- Actions (callable) -----------------
export const actMarkShipped = onCall(async (req) => {
  const uid = req.auth?.uid;
  const { orderId } = req.data || {};
  assert(uid, "unauthenticated", "login required");

  return await txOrder(orderId, async (o) => {
    assert(o.status === "paid", "failed-precondition", "must be paid");
    assert(uid === o.sellerId, "permission-denied", "only seller");
    return { status: "shipped" };
  });
});

export const actConfirmDelivered = onCall(async (req) => {
  const uid = req.auth?.uid;
  const { orderId } = req.data || {};
  assert(uid, "unauthenticated", "login required");

  return await txOrder(orderId, async (o) => {
    assert(o.status === "shipped", "failed-precondition", "must be shipped");
    assert(uid === o.buyerId, "permission-denied", "only buyer");
    return { status: "delivered" };
  });
});

export const actReleaseEscrow = onCall(async (req) => {
  const uid = req.auth?.uid;
  const { orderId } = req.data || {};
  assert(uid, "unauthenticated", "login required");

  return await txOrder(orderId, async (o) => {
    assert(o.status === "delivered", "failed-precondition", "must be delivered");
    assert(uid === o.sellerId, "permission-denied", "only seller");
    return { status: "released", settledAt: FieldValue.serverTimestamp() };
  });
});

export const actOpenDispute = onCall(async (req) => {
  const uid = req.auth?.uid;
  const { orderId, reason } = req.data || {};
  assert(uid, "unauthenticated", "login required");

  return await txOrder(orderId, async (o) => {
    assert(["paid", "shipped"].includes(o.status), "failed-precondition", "dispute only before delivered");
    assert(uid === o.buyerId, "permission-denied", "only buyer");
    return {
      status: "disputed",
      dispute: {
        reason: String(reason || "unspecified").slice(0, 200),
        openedBy: uid,
        openedAt: FieldValue.serverTimestamp(),
      },
    };
  });
});

export const adminResolveDispute = onCall(async (req) => {
  const isAdmin = !!req.auth?.token?.admin;
  const { orderId, resolution } = req.data || {};
  assert(isAdmin, "permission-denied", "admin only");

  return await txOrder(orderId, async (o) => {
    assert(o.status === "disputed", "failed-precondition", "must be disputed");
    const res = String(resolution || "refund").toLowerCase();
    if (res === "refund") {
      return { status: "refunded", resolvedAt: FieldValue.serverTimestamp(), resolution: "refund" };
    } else {
      return {
        status: "released",
        settledAt: FieldValue.serverTimestamp(),
        resolvedAt: FieldValue.serverTimestamp(),
        resolution: "release",
      };
    }
  });
});

// ----------------- Utility endpoints -----------------
export const health = onRequest(async (_req, res) => {
  try {
    await db.collection("_health").doc("ping").set({ at: FieldValue.serverTimestamp() }, { merge: true });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

export const vitals = onRequest(async (req, res) => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    await db.collection("_vitals").add({ ...body, at: FieldValue.serverTimestamp() });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send("error");
  }
});

export const err = onRequest(async (req, res) => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    await db.collection("_errors").add({ ...body, at: FieldValue.serverTimestamp() });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send("error");
  }
});

// ----------------- Admin only: 정산서 PDF -----------------
export const generateSettlementPDF = onCall(async (req) => {
  const isAdmin = !!req.auth?.token?.admin;
  const { orderId } = req.data || {};
  assert(isAdmin, "permission-denied", "admin only");
  assert(orderId, "invalid-argument", "orderId required");

  const ref = db.collection("orders").doc(orderId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError("not-found", "order");
  const o = snap.data();

  const bucket = storage.bucket();
  const path = `public/statements/${orderId}.pdf`;
  const file = bucket.file(path);
  const stream = file.createWriteStream({ contentType: "application/pdf" });

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const done = new Promise((res, rej) => {
    stream.on("finish", res);
    stream.on("error", rej);
  });
  doc.pipe(stream);
  doc.fontSize(18).text("Settlement Statement", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Order: ${orderId}`);
  doc.text(`Listing: ${o.listingId}`);
  doc.text(`Buyer: ${o.buyerId}`);
  doc.text(`Seller: ${o.sellerId}`);
  doc.text(`Price: ${o.price}`);
  doc.text(`Fee: ${o.fee}`);
  doc.text(`Settle: ${o.settleAmount}`);
  doc.text(`Status: ${o.status}`);
  doc.end();
  await done;

  await file.makePublic();
  return { url: `https://storage.googleapis.com/${bucket.name}/${path}` };
});
