// Firebase 관련 서비스들을 auth.js에서 가져옵니다.
import { db } from './auth.js';
import { collection, query, getDocs, orderBy, limit } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

/**
 * 상품 데이터 하나를 받아서 HTML 카드 문자열을 생성하는 함수
 * @param {object} product - 상품 데이터 객체 (id 포함)
 * @returns {string} - 상품 카드의 HTML 문자열
 */
function createProductCardHTML(product) {
    // 숫자를 원화 형식으로 포맷팅 (예: 10000 -> 10,000)
    const price = new Intl.NumberFormat('ko-KR').format(product.price);
    // 상품 이미지가 없을 경우를 대비한 기본 이미지
    const imageUrl = product.imageUrl || 'https://placehold.co/600x600/e2e8f0/64748b?text=이미지없음';
    // 도로롱력은 예시로 랜덤 값을 사용 (나중에 실제 데이터로 교체)
    const dororongPower = (Math.random() * 20 + 80).toFixed(1);

    return `
    <div class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <a href="product_detail.html?id=${product.id}">
            <img src="${imageUrl}" alt="${product.name}" class="w-full h-40 object-cover">
        </a>
        <div class="p-3">
            <h3 class="font-semibold text-gray-800 truncate mb-1">${product.name || '이름 없음'}</h3>
            <p class="font-bold text-lg">${price}원</p>
            <div class="text-xs text-gray-500 mt-2 flex justify-between items-center">
                <span>관심 ${product.likes || 0} · 채팅 ${product.chats || 0}</span>
                <span class="dororong-power">
                   <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                   ${dororongPower}
                </span>
            </div>
        </div>
    </div>
    `;
}

/**
 * Firestore에서 상품 목록을 가져와서 화면에 렌더링하는 메인 함수
 */
async function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    const loadingMessage = document.getElementById('loading-message');

    // 필수 HTML 요소가 없으면 함수를 중단
    if (!productGrid || !loadingMessage) {
        console.error("상품을 표시할 HTML 요소를 찾을 수 없습니다. (id: product-grid, loading-message)");
        return;
    }

    try {
        console.log("Firestore에서 상품 목록을 가져오는 중...");
        // 'products' 컬렉션에 대한 참조를 만듭니다.
        const productsRef = collection(db, "products");
        // 최신 상품 10개를 가져오는 쿼리를 작성합니다. (createdAt 필드 기준 내림차순)
        const q = query(productsRef, orderBy("createdAt", "desc"), limit(10));
        
        // 쿼리를 실행하여 스냅샷을 가져옵니다.
        const querySnapshot = await getDocs(q);

        // 로딩 메시지를 제거합니다.
        loadingMessage.remove();

        // 상품이 하나도 없는 경우
        if (querySnapshot.empty) {
            productGrid.innerHTML = '<p class="col-span-2 text-center text-gray-500">아직 등록된 상품이 없습니다.</p>';
            console.log("데이터베이스에 등록된 상품이 없습니다.");
        } else {
            console.log(`${querySnapshot.size}개의 상품을 성공적으로 불러왔습니다.`);
            let productsHTML = '';
            // 각 상품 문서를 순회하며 HTML을 생성합니다.
            querySnapshot.forEach((doc) => {
                productsHTML += createProductCardHTML({ id: doc.id, ...doc.data() });
            });
            // 생성된 HTML을 그리드에 삽입합니다.
            productGrid.innerHTML = productsHTML;
        }
    } catch (error) {
        // 오류 발생 시 처리
        console.error("상품을 불러오는 중 심각한 오류가 발생했습니다:", error);
        loadingMessage.remove();
        productGrid.innerHTML = `<p class="col-span-2 text-center text-red-500">상품 목록을 불러오는 데 실패했습니다. 관리자에게 문의하세요.</p>`;
    }
}

// 웹 페이지의 모든 요소가 로드된 후에 loadProducts 함수를 실행합니다.
document.addEventListener('DOMContentLoaded', loadProducts);

ded };