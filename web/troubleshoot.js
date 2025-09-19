// 이 파일은 Firestore 데이터베이스 연결을 직접 테스트하기 위한 디버깅용 스크립트입니다.
import { app } from './auth.js';
import { getFirestore, collection, getDocs, limit, query } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

async function testFirestoreConnection() {
  console.log("Firestore 연결 테스트를 시작합니다...");
  try {
    const db = getFirestore(app);
    // 'products' 컬렉션에서 문서를 1개만 가져오는 쿼리를 시도합니다.
    // 실제 컬렉션 이름이 'products'가 아니라면 이 부분을 수정해야 합니다.
    const q = query(collection(db, "products"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("Firestore 데이터 테스트 경고: 'products' 컬렉션에 데이터가 없거나 접근 권한이 없을 수 있습니다.");
    } else {
      console.log("✅ Firestore 데이터 테스트 성공! 데이터베이스 연결 및 읽기가 정상적으로 동작합니다.");
      querySnapshot.forEach((doc) => {
        console.log("가져온 데이터 샘플:", doc.id, "=>", doc.data());
      });
    }
  } catch (error) {
    console.error("❌ Firestore 데이터 테스트 실패! 아래 오류가 페이지 붕괴의 원인일 가능성이 매우 높습니다.");
    console.error(error);
  }
}

// 페이지 로드 후 2초 뒤에 테스트 함수를 실행합니다. (Firebase 초기화 시간을 기다립니다)
setTimeout(testFirestoreConnection, 2000);

